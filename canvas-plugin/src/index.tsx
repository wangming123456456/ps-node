// PS 能力已内置到画布：本插件不再注册可创建的节点、工具条按钮和反向 worker，
// 只保留旧画布里 ps:layer 节点的渲染。画布读取画布时会把这些节点迁移成图片卡片，
// 迁移完这个插件就可以从「节点插件」里卸载。
import { definePlugin } from "@infinite-canvas/plugin-sdk";
import type { CanvasNodeContentProps } from "@infinite-canvas/plugin-sdk";

function LegacyContent({ ctx }: CanvasNodeContentProps) {
    const content = typeof ctx.node.metadata?.content === "string" ? ctx.node.metadata.content : "";
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                height: "100%",
                padding: 14,
                boxSizing: "border-box",
                background: ctx.theme.node.fill,
                color: ctx.theme.node.muted,
                fontSize: 12,
                lineHeight: 1.6,
                textAlign: "center",
            }}
        >
            {content ? <img src={content} alt="" style={{ maxWidth: "100%", maxHeight: "62%", objectFit: "contain", borderRadius: 8 }} /> : null}
            <span>PS 能力已内置：直接用图片卡片，工具条里的「推送到 PS / 从 PS 取回」就能用；本插件可以卸载。</span>
        </div>
    );
}

export default definePlugin({
    id: "ps",
    name: "PS 节点（已内置，可卸载）",
    version: "0.2.0",
    description: "画布已内置 PS 能力：用图片卡片即可；本插件只保留旧节点显示，可安全卸载",
    nodes: [
        {
            type: "ps:layer",
            title: "Photoshop（旧）",
            icon: "🎨",
            description: "历史节点：PS 能力已内置到图片卡片，不会再新建这种节点",
            showInCreateMenu: false,
            defaultSize: { width: 340, height: 380 },
            defaultMetadata: { content: "" },
            resource: (node) => {
                const url = typeof node.metadata?.content === "string" ? node.metadata.content : "";
                return url ? { kind: "image", url } : null;
            },
            Content: LegacyContent,
        },
    ],
});
