import { definePlugin } from "@infinite-canvas/plugin-sdk";

import css from "./styles.css";
import { NodeContent, nodeToolbar } from "./ui";
import { nodeActions } from "./node-actions";

export default definePlugin({
    id: "ps",
    name: "PS 节点",
    version: "0.1.26",
    description: "画布 ↔ Photoshop 通道：任意图片节点右键即可推送到 PS / 从 PS 取回",
    css,
    nodeActions,
    nodes: [
        {
            type: "ps:layer",
            title: "Photoshop",
            icon: "🎨",
            description: "画布 ↔ PS 通道：推送 / 取回 / 设置；节点上可直接用画布的修图工具",
            defaultSize: { width: 340, height: 380 },
            defaultMetadata: { content: "", psStatus: "idle", psDoc: "", psLayer: "", psError: "", psStartedAt: 0 },
            minimapColor: "#31a8ff",
            // 画布图片工具（裁剪/标注/消除/调色/重打光…）的结果直接写回本节点，
            // 这样「取回 → 在节点上修 → 自动进 PS 面板预览 → 点落层」是一条闭环。
            editTarget: "self",
            resource: (node) => {
                const url = typeof node.metadata?.content === "string" ? node.metadata.content : "";
                return url ? { kind: "image", url } : null;
            },
            toolbar: nodeToolbar,
            Content: NodeContent,
        },
    ],
});
