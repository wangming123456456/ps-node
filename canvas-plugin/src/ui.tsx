import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "@infinite-canvas/plugin-sdk";
import type { CanvasNodeContentProps, CanvasNodeContext, CanvasNodePanelProps, CanvasNodeToolbarItem, CanvasTheme } from "@infinite-canvas/plugin-sdk";

import { checkHealth, loadSettings, pullFromPs, pushToPs, readError, readStatus, refreshDocs, saveSettings, type PsDoc, type PsSettings } from "./actions";
import { startPsRequestWorker } from "./ps-requests";

const STATUS_LABELS: Record<string, string> = {
    idle: "未连接",
    pushing: "推送中",
    inPS: "已在 PS",
    pulling: "取回中",
    done: "已完成",
    error: "出错",
};

const RUNNING_LABELS: Record<string, string> = {
    pushing: "推送到 PS",
    pulling: "从 PS 取回",
};

const RUNNING_STATUSES = new Set(["pushing", "pulling"]);
const MAX_EDGE_OPTIONS = [1024, 1536, 2048, 0];

/** 只从画布主题取色，浅色/深色主题自动跟随。 */
function themeVars(theme: CanvasTheme): CSSProperties {
    return {
        "--ps-text": theme.node.text,
        "--ps-muted": theme.node.muted,
        "--ps-placeholder": theme.node.placeholder,
        "--ps-panel": theme.node.panel,
        "--ps-stroke": theme.node.stroke,
        "--ps-hover": theme.toolbar.itemHover,
        "--ps-active": theme.toolbar.activeBg,
    } as unknown as CSSProperties;
}

function dotClass(status: string): string {
    if (status === "error") return "ps-dot ps-dot--error";
    if (RUNNING_STATUSES.has(status)) return "ps-dot ps-dot--busy";
    if (status === "inPS" || status === "done") return "ps-dot ps-dot--ok";
    return "ps-dot";
}

function readMeta(ctx: CanvasNodeContext, key: string): string {
    const value = ctx.node.metadata?.[key];
    return typeof value === "string" ? value : "";
}

const STALE_RUN_MS = 120_000;

/** 运行态超过 2 分钟视为上次操作已中断（中继/PS 卡住时不至于一直转圈）。 */
function isStaleRun(ctx: CanvasNodeContext): boolean {
    if (!RUNNING_STATUSES.has(readStatus(ctx))) return false;
    const startedAt = typeof ctx.node.metadata?.psStartedAt === "number" ? ctx.node.metadata.psStartedAt : 0;
    return Boolean(startedAt) && Date.now() - startedAt > STALE_RUN_MS;
}

/** 运行中每 0.5s 刷新一次耗时。 */
function useElapsed(ctx: CanvasNodeContext, running: boolean): number {
    const startedAt = typeof ctx.node.metadata?.psStartedAt === "number" ? ctx.node.metadata.psStartedAt : 0;
    const [, setTick] = useState(0);
    useEffect(() => {
        if (!running) return;
        const timer = window.setInterval(() => setTick((value) => value + 1), 500);
        return () => window.clearInterval(timer);
    }, [running, startedAt]);
    if (!running || !startedAt) return 0;
    return Math.max(0, Math.round((Date.now() - startedAt) / 1000));
}

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

function EmptyIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="9" r="1.5" />
            <path d="m21 15-5-5L5 20" />
        </svg>
    );
}

function PushIcon() {
    return (
        <svg className="ps-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
        </svg>
    );
}

function PullIcon() {
    return (
        <svg className="ps-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
        </svg>
    );
}

export function NodeContent({ ctx }: CanvasNodeContentProps) {
    const content = readMeta(ctx, "content");
    const stale = isStaleRun(ctx);
    const status = stale ? "error" : readStatus(ctx);
    const error = stale ? "上次操作没有完成，可重新推送或取回" : readError(ctx);
    const running = RUNNING_STATUSES.has(status);
    const elapsed = useElapsed(ctx, running);

    // PS 面板发来的生成/模型列表请求由这个节点处理（多节点时谁领取谁处理）。
    const ctxRef = useRef<CanvasNodeContext | null>(ctx);
    ctxRef.current = ctx;
    useEffect(() => startPsRequestWorker(() => ctxRef.current), []);

    return (
        <div className="ps-root ps-node" style={themeVars(ctx.theme)}>
            {content ? (
                <img className="ps-node__image" src={content} alt="" draggable={false} />
            ) : (
                <div className="ps-node__empty">
                    <EmptyIcon />
                    <span>从 PS 取回画面</span>
                </div>
            )}
            <div className="ps-node__status">
                <span className={dotClass(status)} />
                <span>{STATUS_LABELS[status] ?? status}</span>
                {running && elapsed > 0 ? <span className="ps-node__timer">{elapsed}s</span> : null}
            </div>
            {error ? (
                <div className="ps-node__error" title={error}>
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
    const [docs, setDocs] = useState<PsDoc[]>([]);
    const [docsState, setDocsState] = useState<"idle" | "loading" | "ready" | "error">("idle");
    const [healthText, setHealthText] = useState("连接中…");
    const [busy, setBusy] = useState(false);

    const stale = isStaleRun(ctx);
    const status = stale ? "error" : readStatus(ctx);
    const error = stale ? "上次操作没有完成，可重新推送或取回" : readError(ctx);
    const running = RUNNING_STATUSES.has(status);
    const elapsed = useElapsed(ctx, running);
    const disabled = !settings || busy;

    useEffect(() => {
        if (!settings) return;
        setUrl(settings.baseUrl);
        setToken(settings.token);
    }, [settings]);

    const loadDocs = useCallback(async (current: PsSettings) => {
        setDocsState("loading");
        try {
            const list = await refreshDocs(current);
            setDocs(list);
            setDocsState("ready");
            setHealthText("PS 在线");
        } catch (loadError) {
            setDocsState("error");
            setHealthText(`未连接：${loadError instanceof Error ? loadError.message : String(loadError)}`);
        }
    }, []);

    useEffect(() => {
        if (!settings) return;
        void loadDocs(settings);
    }, [settings, loadDocs]);

    const runTask = async (task: (ctx: CanvasNodeContext, settings: PsSettings) => Promise<void>) => {
        setBusy(true);
        try {
            await task(ctx, await loadSettings(ctx));
        } finally {
            setBusy(false);
            const current = await loadSettings(ctx);
            void loadDocs(current);
        }
    };

    const testConnection = async () => {
        if (!settings) return;
        const result = await checkHealth(await loadSettings(ctx));
        setHealthText(result?.ok ? (result.photoshop?.connected ? "PS 在线" : "中继在线，PS 未连接") : "中继未连接");
    };

    const docValue = settings?.doc ?? "";
    const docOptions = docs.some((doc) => doc.name === docValue) || !docValue ? null : <option value={docValue}>{docValue}</option>;

    return (
        <div className="ps-root ps-panel" data-canvas-no-zoom onMouseDown={(event) => event.stopPropagation()} style={themeVars(ctx.theme)}>
            <div className="ps-bar">
                <span className="ps-status">
                    <span className={docsState === "error" ? "ps-dot ps-dot--error" : "ps-dot ps-dot--ok"} />
                    <span className="ps-status__text" title={healthText}>
                        {healthText}
                    </span>
                </span>
                <button type="button" className="ps-textbtn" disabled={!settings || docsState === "loading"} onClick={() => settings && void loadDocs(settings)}>
                    {docsState === "loading" ? "刷新中" : "刷新文档"}
                </button>
            </div>

            <div className="ps-controls">
                <select className="ps-select" value={docValue} disabled={disabled} onChange={(event) => void update({ doc: event.target.value })}>
                    <option value="">跟随当前文档</option>
                    {docOptions}
                    {docs.map((doc) => (
                        <option key={doc.name} value={doc.name}>
                            {doc.name} · {doc.width}×{doc.height}
                        </option>
                    ))}
                </select>
                <div className="ps-seg" role="group" aria-label="输出尺寸">
                    {MAX_EDGE_OPTIONS.map((value) => (
                        <button key={value} type="button" aria-pressed={settings?.maxEdge === value} onClick={() => void update({ maxEdge: value })}>
                            {value === 0 ? "原图" : value}
                        </button>
                    ))}
                </div>
            </div>

            <div className="ps-actions">
                <button type="button" className="ps-action ps-action--strong" disabled={disabled} onClick={() => void runTask(pushToPs)}>
                    <PushIcon />
                    推送
                </button>
                <button type="button" className="ps-action" disabled={disabled} onClick={() => void runTask(pullFromPs)}>
                    <PullIcon />
                    取回
                </button>
                <span className="ps-spacer" />
                {running ? (
                    <span className="ps-hint ps-hint--nowrap">
                        {RUNNING_LABELS[status] ?? "运行中"} · {elapsed}s
                    </span>
                ) : error ? (
                    <span className="ps-error ps-hint--nowrap" title={error}>
                        {error}
                    </span>
                ) : null}
            </div>

            <div className="ps-hint ps-hint--tip">
                生成 / 改图用图片节点：图片节点 → 本节点（推送结果）；本节点 → 图片节点（PS 画面当参考）
            </div>

            <details className="ps-details">
                <summary>中继设置</summary>
                <div className="ps-details__body">
                    <input
                        className="ps-input"
                        value={url}
                        placeholder="http://localhost:23310"
                        onChange={(event) => setUrl(event.target.value)}
                        onBlur={() => url !== settings?.baseUrl && void update({ baseUrl: url })}
                    />
                    <input
                        className="ps-input"
                        value={token}
                        placeholder="token（宿主注入，可留空）"
                        onChange={(event) => setToken(event.target.value)}
                        onBlur={() => token !== settings?.token && void update({ token })}
                    />
                    <div className="ps-row">
                        <span className="ps-spacer" />
                        <button type="button" className="ps-textbtn" disabled={!settings} onClick={() => void testConnection()}>
                            测试连接
                        </button>
                    </div>
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
    ];
}
