// 通道节点的动作：推送、取回。生成/改图交给画布现有的图片节点，这里只负责过桥。
import type { CanvasNodeContext, PluginStorage } from "@infinite-canvas/plugin-sdk";

import { health, relayEndpoint, runCommand, type RelayHealth } from "./relay";

export const SETTINGS_KEY = "settings.v1";
export const DEFAULT_MAX_EDGE = 2048;

export type PsStatus = "idle" | "pushing" | "inPS" | "pulling" | "done" | "error";

export type PsSettings = { maxEdge: number; doc: string };

export type PsDoc = { name: string; width: number; height: number };

type SettingsOwner = { storage: PluginStorage };

/** 本地只存输出尺寸和目标文档：中继地址/token 一律跟随宿主注入。 */
export async function loadSettings(owner: SettingsOwner): Promise<PsSettings> {
    const saved = (await owner.storage.get<Partial<PsSettings>>(SETTINGS_KEY)) ?? {};
    return {
        maxEdge: typeof saved.maxEdge === "number" ? saved.maxEdge : DEFAULT_MAX_EDGE,
        doc: saved.doc || "",
    };
}

export async function saveSettings(owner: SettingsOwner, patch: Partial<PsSettings>): Promise<PsSettings> {
    const next = { ...(await loadSettings(owner)), ...patch };
    await owner.storage.set(SETTINGS_KEY, next);
    return next;
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

/** 绑定的文档改名/关闭时，PS 会报这两种错误，用来触发「退回当前活动文档」。 */
function isDocumentMissing(error: unknown): boolean {
    const text = errorText(error);
    return text.includes("文档不存在") || text.includes("没有打开的文档");
}

export type PsSelection = { left: number; top: number; right: number; bottom: number };

async function pushLayer(image: string, doc: string | undefined, layerName: string, selection?: PsSelection) {
    return runCommand<{ doc: string; layer?: string; width?: number; height?: number }>(relayEndpoint(), "push", {
        image,
        mode: "layer",
        doc,
        layerName,
        selection,
    });
}

async function pushNewDocument(image: string) {
    return runCommand<{ doc: string; layer?: string; width?: number; height?: number }>(relayEndpoint(), "push", {
        image,
        mode: "newDoc",
        layerName: layerName(),
    });
}

async function pullImage(settings: PsSettings, doc: string | undefined) {
    return runCommand<{ image: string; doc: string; width?: number; height?: number; selection?: PsSelection }>(relayEndpoint(), "pull", {
        doc,
        maxEdge: settings.maxEdge,
    });
}

function fail(ctx: CanvasNodeContext, error: unknown): void {
    ctx.updateMetadata({ psStatus: "error", psError: errorText(error) });
}

function begin(ctx: CanvasNodeContext, status: PsStatus): void {
    ctx.updateMetadata({ psStatus: status, psError: "", psStartedAt: Date.now() });
}

function layerName(): string {
    const time = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
    return `画布 ${time}`;
}

export async function checkHealth(): Promise<RelayHealth | null> {
    try {
        return await health(relayEndpoint());
    } catch {
        return null;
    }
}

export async function refreshDocs(): Promise<PsDoc[]> {
    const data = await runCommand<{ docs: PsDoc[] }>(relayEndpoint(), "docs", {});
    return data.docs;
}

/** blob:/http(s) 地址先转成 dataURL：PS 侧只能按 dataURL 写临时文件。 */
export async function toDataUrl(url: string): Promise<string> {
    if (!url) return "";
    if (url.startsWith("data:")) return url;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`读取图片失败（${response.status}）`);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
        reader.onerror = () => reject(new Error("读取图片失败"));
        reader.readAsDataURL(blob);
    });
}

/** 推送源优先级：上游图（图片节点生成结果）→ 下游图（反向连回来）→ 节点自身内容（取回的画面）。 */
export async function readPushImage(ctx: CanvasNodeContext): Promise<string> {
    const imageOf = (node: { metadata?: Record<string, unknown> }) => {
        const content = node.metadata?.content;
        return typeof content === "string" ? content : "";
    };
    const candidates = [...ctx.getUpstream(), ...ctx.getDownstream(), ctx.node];
    for (const node of candidates) {
        const image = imageOf(node);
        if (!image) continue;
        try {
            return await toDataUrl(image);
        } catch {
            continue;
        }
    }
    return "";
}

export async function pushToPs(ctx: CanvasNodeContext, settings: PsSettings): Promise<void> {
    const image = await readPushImage(ctx);
    if (!image) {
        ctx.updateMetadata({ psStatus: "error", psError: "没有可推送的图：接一个图片节点，或先从 PS 取回" });
        return;
    }
    begin(ctx, "pushing");
    const name = layerName();
    const selection = (ctx.node.metadata?.psSelection as PsSelection | null | undefined) || undefined;
    try {
        const target = settings.doc || readPsDoc(ctx);
        let data;
        try {
            data = await pushLayer(image, target || undefined, name, selection);
        } catch (error) {
            if (!isDocumentMissing(error)) throw error;
            try {
                data = await pushLayer(image, undefined, name, selection);
            } catch (retryError) {
                if (!isDocumentMissing(retryError)) throw retryError;
                data = await pushNewDocument(image);
            }
        }
        ctx.updateMetadata({ content: image, psStatus: "inPS", psDoc: data.doc, psLayer: data.layer ?? "", psError: "" });
    } catch (error) {
        fail(ctx, error);
    }
}

/** 把画布里刚生成的结果送到 PS 面板的「结果」预览；用户点预览才落成图层。 */
export async function previewToPs(ctx: CanvasNodeContext, image: string): Promise<void> {
    const selection = (ctx.node.metadata?.psSelection as PsSelection | null | undefined) || undefined;
    await runCommand<{ shown?: boolean }>(relayEndpoint(), "preview", { image: await toDataUrl(image), doc: readPsDoc(ctx), selection }, 8_000);
}

export async function pullFromPs(ctx: CanvasNodeContext, settings: PsSettings): Promise<void> {    begin(ctx, "pulling");
    try {
        let data;
        try {
            data = await pullImage(settings, settings.doc || undefined);
        } catch (error) {
            if (!isDocumentMissing(error)) throw error;
            data = await pullImage(settings, undefined);
        }
        ctx.updateMetadata({
            content: data.image,
            psStatus: "done",
            psDoc: data.doc,
            psError: "",
            psSelection: data.selection ?? null,
        });
    } catch (error) {
        fail(ctx, error);
    }
}
