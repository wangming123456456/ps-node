import { useCallback, useEffect, useState } from "@infinite-canvas/plugin-sdk";
import type { CanvasNodeContentProps, CanvasNodeContext, CanvasNodePanelProps, CanvasNodeToolbarItem } from "@infinite-canvas/plugin-sdk";

import { checkHealth, loadSettings, optimizeInPs, pullFromPs, pushToPs, refreshDocs, saveSettings, type PsSettings } from "./actions";

const STATUS_LABELS: Record<string, string> = {
    idle: "未连接",
    pushing: "推送中…",
    inPS: "已在 PS",
    pulling: "取回中…",
    optimizing: "AI 优化中…",
    done: "已完成",
    error: "出错",
};

function useSettings(ctx: CanvasNodeContext) {
    const [settings, setSettings] = useState<PsSettings | null>(null);
    useEffect(() => {
        let alive = true;
        void loadSettings(ctx).then((value) => {
            if (alive) setSettings(value);
        });
        return () => {
            alive = false;
        };
    }, [ctx]);
    const update = useCallback(
        async (patch: Partial<PsSettings>) => {
            const next = await saveSettings(ctx, patch);
            setSettings(next);
            return next;
        },
        [ctx],
    );
    return { settings, update };
}

export function NodeContent({ ctx }: CanvasNodeContentProps) {
    const content = typeof ctx.node.metadata?.content === "string" ? ctx.node.metadata.content : "";
    const status = typeof ctx.node.metadata?.psStatus === "string" ? ctx.node.metadata.psStatus : "idle";
    const error = typeof ctx.node.metadata?.psError === "string" ? ctx.node.metadata.psError : "";
    const theme = ctx.theme.node;

    return (
        <div
            data-canvas-no-zoom
            onMouseDown={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
            style={{ position: "relative", height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 10, boxSizing: "border-box", color: theme.text }}
        >
            {content ? (
                <img src={content} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 8 }} />
            ) : (
                <div style={{ color: theme.placeholder, fontSize: 13, textAlign: "center", lineHeight: 1.6 }}>
                    还没有图
                    <br />
                    在面板里「从 PS 取回」，或把上游图片接过来
                </div>
            )}
            <div style={{ position: "absolute", top: 8, left: 8, padding: "2px 8px", borderRadius: 999, fontSize: 11, background: theme.panel, border: `1px solid ${theme.stroke}`, color: theme.muted }}>
                {STATUS_LABELS[status] ?? status}
            </div>
            {error ? (
                <div style={{ position: "absolute", left: 8, right: 8, bottom: 8, padding: "4px 8px", borderRadius: 6, background: theme.panel, border: `1px solid ${theme.stroke}`, color: "#f87171", fontSize: 11, lineHeight: 1.4, maxHeight: 48, overflow: "hidden" }}>
                    {error}
                </div>
            ) : null}
        </div>
    );
}

export function NodePanel({ ctx }: CanvasNodePanelProps) {
    const { settings, update } = useSettings(ctx);
    const [url, setUrl] = useState("");
    const [token, setToken] = useState("");
    const [doc, setDoc] = useState("");
    const [healthText, setHealthText] = useState("检测中…");
    const [busy, setBusy] = useState(false);
    const theme = ctx.theme.node;

    useEffect(() => {
        if (!settings) return;
        setUrl(settings.baseUrl);
        setToken(settings.token);
        setDoc(settings.doc);
        void checkHealth(settings).then((result) => {
            setHealthText(result?.ok ? (result.photoshop?.connected ? "已连接 · PS 在线" : "已连接 · PS 未连接") : "未连接");
        });
    }, [settings]);

    const run = async (task: (ctx: CanvasNodeContext, settings: PsSettings) => Promise<void>) => {
        setBusy(true);
        try {
            await task(ctx, await loadSettings(ctx));
        } finally {
            setBusy(false);
        }
    };

    const refresh = async () => {
        const current = await loadSettings(ctx);
        try {
            const docs = await refreshDocs(current);
            setHealthText(`已连接 · ${docs.length} 个文档`);
            if (docs[0]) setDoc(docs[0].name);
        } catch (error) {
            setHealthText(error instanceof Error ? error.message : String(error));
        }
    };

    const button = { padding: "5px 10px", borderRadius: 8, border: `1px solid ${theme.stroke}`, background: "transparent", color: theme.text, cursor: "pointer", fontSize: 12 } as const;
    const input = { width: "100%", padding: "5px 8px", borderRadius: 8, border: `1px solid ${theme.stroke}`, background: "transparent", color: theme.text, fontSize: 12, boxSizing: "border-box" } as const;

    return (
        <div data-canvas-no-zoom onMouseDown={(event) => event.stopPropagation()} style={{ display: "flex", flexDirection: "column", gap: 8, padding: 10, color: theme.text, fontSize: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: healthText.startsWith("已连接") ? "#4ade80" : "#f87171" }} />
                <span style={{ color: theme.muted }}>{healthText}</span>
                <button type="button" style={{ ...button, marginLeft: "auto" }} onClick={() => void refresh()}>
                    刷新文档
                </button>
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ color: theme.muted }}>目标文档（留空=新建）</span>
                <input style={input} value={doc} placeholder="未标题-1" onChange={(event) => setDoc(event.target.value)} onBlur={() => void update({ doc })} />
            </label>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <button type="button" style={button} disabled={busy} onClick={() => void run(pushToPs)}>
                    推送到 PS
                </button>
                <button type="button" style={button} disabled={busy} onClick={() => void run(pullFromPs)}>
                    从 PS 取回
                </button>
                <button type="button" style={button} disabled={busy} onClick={() => void run(optimizeInPs)}>
                    AI 优化回 PS
                </button>
            </div>

            <details style={{ color: theme.muted }}>
                <summary style={{ cursor: "pointer" }}>中继设置</summary>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 6 }}>
                    <input style={input} value={url} placeholder="http://localhost:23310" onChange={(event) => setUrl(event.target.value)} onBlur={() => void update({ baseUrl: url })} />
                    <input style={input} value={token} placeholder="token（宿主启动中继后注入）" onChange={(event) => setToken(event.target.value)} onBlur={() => void update({ token })} />
                </div>
            </details>
        </div>
    );
}

function toolbarAction(ctx: CanvasNodeContext, id: string, label: string, icon: string, task: (ctx: CanvasNodeContext, settings: PsSettings) => Promise<void>): CanvasNodeToolbarItem {
    return {
        id,
        title: label,
        label,
        icon,
        onClick: () => {
            void loadSettings(ctx).then((settings) => task(ctx, settings));
        },
    };
}

export function nodeToolbar(ctx: CanvasNodeContext): CanvasNodeToolbarItem[] {
    return [
        toolbarAction(ctx, "ps-push", "推送", "⬆️", pushToPs),
        toolbarAction(ctx, "ps-pull", "取回", "⬇️", pullFromPs),
        toolbarAction(ctx, "ps-optimize", "AI 优化", "✨", optimizeInPs),
    ];
}
