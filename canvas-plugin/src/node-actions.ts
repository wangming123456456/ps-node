// 任意节点右键菜单里的 PS 动作：把该节点的图推到 PS，或把 PS 画面取回到该节点。
import type { CanvasPluginActionContext, CanvasPluginNodeAction } from "@infinite-canvas/plugin-sdk";

import { loadSettings, toDataUrl } from "./actions";
import { relayEndpoint, runCommand } from "./relay";

function layerName(): string {
    const time = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
    return `画布 ${time}`;
}

/** 推送该节点的图到 PS（有选区时 PS 侧贴回选区）。 */
export async function pushNodeToPs(context: CanvasPluginActionContext): Promise<void> {
    const content = typeof context.node.metadata?.content === "string" ? context.node.metadata.content : "";
    if (!content) throw new Error("这个节点还没有图片");
    const image = await toDataUrl(content);
    const settings = await loadSettings(context);
    const data = await runCommand<{ doc: string; layer?: string }>(
        relayEndpoint(),
        "push",
        { image, mode: "layer", doc: settings.doc || undefined, layerName: layerName() },
    );
    context.updateMetadata(context.node.id, {
        content: image,
        psDoc: data.doc,
        psLayer: data.layer ?? "",
        psStatus: "inPS",
    });
}

/** 把 PS 当前画面（有选区则取选区）写回该节点。 */
export async function pullToNode(context: CanvasPluginActionContext): Promise<void> {
    const settings = await loadSettings(context);
    const data = await runCommand<{ image: string; doc: string; width?: number; height?: number }>(
        relayEndpoint(),
        "pull",
        { doc: settings.doc || undefined, maxEdge: settings.maxEdge },
    );
    context.updateMetadata(context.node.id, {
        content: data.image,
        status: "success",
        naturalWidth: data.width ?? context.node.metadata?.naturalWidth,
        naturalHeight: data.height ?? context.node.metadata?.naturalHeight,
    });
}

/** 右键菜单动作：图片节点才显示。 */
export function nodeActions(node: { type: string }): CanvasPluginNodeAction[] {
    if (node.type !== "image") return [];
    return [
        { id: "push-to-ps", label: "推送到 PS", icon: "⬆️", run: pushNodeToPs },
        { id: "pull-from-ps", label: "从 PS 取回", icon: "⬇️", run: pullToNode },
    ];
}
