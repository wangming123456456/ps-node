// 节点上的三个动作：推送、取回、AI 优化。只依赖中继协议与宿主 ctx.ai。
import type { CanvasNodeContext } from "@infinite-canvas/plugin-sdk";

import { health, normalizeBaseUrl, readInjectedEndpoint, runCommand, type RelayEndpoint, type RelayHealth } from "./relay";

export const SETTINGS_KEY = "settings.v1";
export const DEFAULT_MAX_EDGE = 2048;

// AI 优化用的固定提示词：只做画质/质感增强，不改变构图与主体。
export const OPTIMIZE_PROMPT = "在保持构图、主体和文字不变的前提下提升画面质感：皮肤细腻、光影柔和、细节清晰，输出高质量精修图。";

export type PsStatus = "idle" | "pushing" | "inPS" | "pulling" | "optimizing" | "done" | "error";

export type PsSettings = { baseUrl: string; token: string; maxEdge: number; doc: string };

export type PsDoc = { name: string; width: number; height: number };

export async function loadSettings(ctx: CanvasNodeContext): Promise<PsSettings> {
    const saved = (await ctx.storage.get<Partial<PsSettings>>(SETTINGS_KEY)) ?? {};
    const injected = readInjectedEndpoint();
    return {
        baseUrl: normalizeBaseUrl(saved.baseUrl || injected.baseUrl),
        token: saved.token || injected.token || "",
        maxEdge: typeof saved.maxEdge === "number" ? saved.maxEdge : DEFAULT_MAX_EDGE,
        doc: saved.doc || "",
    };
}

export async function saveSettings(ctx: CanvasNodeContext, patch: Partial<PsSettings>): Promise<PsSettings> {
    const next = { ...(await loadSettings(ctx)), ...patch };
    await ctx.storage.set(SETTINGS_KEY, next);
    return next;
}

export function endpointOf(settings: PsSettings): RelayEndpoint {
    return { baseUrl: settings.baseUrl, token: settings.token };
}

export function readPsDoc(ctx: CanvasNodeContext): string {
    return typeof ctx.node.metadata?.psDoc === "string" ? ctx.node.metadata.psDoc : "";
}

export function readStatus(ctx: CanvasNodeContext): PsStatus {
    const value = ctx.node.metadata?.psStatus;
    return typeof value === "string" ? (value as PsStatus) : "idle";
}

export function readError(ctx: CanvasNodeContext): string {
    return typeof ctx.node.metadata?.psError === "string" ? ctx.node.metadata.psError : "";
}

function errorText(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function fail(ctx: CanvasNodeContext, error: unknown): void {
    ctx.updateMetadata({ psStatus: "error", psError: errorText(error) });
}

function begin(ctx: CanvasNodeContext, status: PsStatus): void {
    ctx.updateMetadata({ psStatus: status, psError: "", psStartedAt: Date.now() });
}

function layerName(): string {
    const time = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
    return `AI 优化 ${time}`;
}

export async function checkHealth(settings: PsSettings): Promise<RelayHealth | null> {
    try {
        return await health(endpointOf(settings));
    } catch {
        return null;
    }
}

export async function refreshDocs(settings: PsSettings): Promise<PsDoc[]> {
    const data = await runCommand<{ docs: PsDoc[] }>(endpointOf(settings), "docs", {});
    return data.docs;
}

export async function pushToPs(ctx: CanvasNodeContext, settings: PsSettings): Promise<void> {
    const image = typeof ctx.node.metadata?.content === "string" ? ctx.node.metadata.content : "";
    if (!image) {
        ctx.updateMetadata({ psStatus: "error", psError: "节点里没有图：先从 PS 取回，或接一个图片节点" });
        return;
    }
    begin(ctx, "pushing");
    try {
        const doc = settings.doc || readPsDoc(ctx);
        const data = await runCommand<{ doc: string; layer?: string; width?: number; height?: number }>(endpointOf(settings), "push", {
            image,
            mode: doc ? "layer" : "newDoc",
            doc,
            layerName: layerName(),
        });
        ctx.updateMetadata({ psStatus: "inPS", psDoc: data.doc, psLayer: data.layer ?? "", psError: "" });
    } catch (error) {
        fail(ctx, error);
    }
}

export async function pullFromPs(ctx: CanvasNodeContext, settings: PsSettings): Promise<void> {
    begin(ctx, "pulling");
    try {
        const data = await runCommand<{ image: string; doc: string }>(endpointOf(settings), "pull", {
            doc: settings.doc || readPsDoc(ctx) || undefined,
            maxEdge: settings.maxEdge,
        });
        ctx.updateMetadata({ content: data.image, psStatus: "done", psDoc: data.doc, psError: "" });
    } catch (error) {
        fail(ctx, error);
    }
}

/** 取回 → 宿主 AI 生成 → 贴回 PS 新图层 → 同步画布（D5：v1 不接 ComfyUI）。 */
export async function optimizeInPs(ctx: CanvasNodeContext, settings: PsSettings): Promise<void> {
    begin(ctx, "optimizing");
    try {
        const pulled = await runCommand<{ image: string; doc: string }>(endpointOf(settings), "pull", {
            doc: settings.doc || readPsDoc(ctx) || undefined,
            maxEdge: settings.maxEdge,
        });
        const generated = await ctx.ai.generateImage(OPTIMIZE_PROMPT, { references: [pulled.image] });
        const image = generated.images[0];
        if (!image) throw new Error("AI 没有返回图片");
        const pushed = await runCommand<{ doc: string; layer?: string }>(endpointOf(settings), "push", {
            image,
            mode: "layer",
            doc: pulled.doc,
            layerName: layerName(),
        });
        ctx.updateMetadata({ content: image, psStatus: "done", psDoc: pushed.doc, psLayer: pushed.layer ?? "", psError: "" });
    } catch (error) {
        fail(ctx, error);
    }
}
