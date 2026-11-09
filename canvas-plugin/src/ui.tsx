import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "@infinite-canvas/plugin-sdk";
import type { CanvasNodeContentProps, CanvasNodeContext, CanvasNodeToolbarItem, CanvasTheme } from "@infinite-canvas/plugin-sdk";

import { loadSettings, previewToPs, pullFromPs, pushToPs, readError, readStatus, type PsSettings } from "./actions";
import { startPsRequestWorker } from "./ps-requests";
import { openSettingsOverlay } from "./settings";

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

const STALE_RUN_MS = 120_000;

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

    // 画布里刚生成的新图（metadata.generatedAt 变新）送到 PS 面板的「结果」预览，用户点预览才落图层。
    const autoPreviewedAt = useRef(Number(ctx.node.metadata?.generatedAt || 0));
    useEffect(() => {
        const generatedAt = Number(ctx.node.metadata?.generatedAt || 0);
        const generated = typeof ctx.node.metadata?.content === "string" ? ctx.node.metadata.content : "";
        if (!generatedAt || generatedAt === autoPreviewedAt.current || !generated) return;
        autoPreviewedAt.current = generatedAt;
        void (async () => {
            try {
                // 不先探健康状态：中继的 photoshop.connected 是按 15s 窗口算的，而 PS 面板 25s 才轮询一次，
                // 中间有一段会误报未连接，直接把预览发过去、短超时就够了。
                await previewToPs(ctx, generated);
                ctx.updateMetadata({ psPreviewAt: Date.now(), psPreviewError: "" });
            } catch (error) {
                ctx.updateMetadata({ psPreviewError: error instanceof Error ? error.message : String(error) });
            }
        })();
    }, [ctx.node.metadata?.generatedAt, ctx.node.metadata?.content]);

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
        {
            id: "ps-settings",
            title: "设置",
            label: "设置",
            icon: "⚙️",
            onClick: () => openSettingsOverlay(ctx),
        },
    ];
}
