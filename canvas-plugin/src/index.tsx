import { definePlugin } from "@infinite-canvas/plugin-sdk";

import css from "./styles.css";
import { NodeContent, nodeToolbar } from "./ui";
import { openSettingsOverlay } from "./settings";

export default definePlugin({
    id: "ps",
    name: "PS 节点",
    version: "0.1.12",
    description: "画布 ↔ Photoshop 通道：推送 / 取回，设置收进工具栏齿轮",
    css,
    nodes: [
        {
            type: "ps:layer",
            title: "Photoshop",
            icon: "🎨",
            description: "画布 ↔ PS 通道：推送 / 取回 / 设置；生成改图用图片节点",
            defaultSize: { width: 340, height: 380 },
            defaultMetadata: { content: "", psStatus: "idle", psDoc: "", psLayer: "", psError: "", psStartedAt: 0 },
            minimapColor: "#31a8ff",
            resource: (node) => {
                const url = typeof node.metadata?.content === "string" ? node.metadata.content : "";
                return url ? { kind: "image", url } : null;
            },
            onDoubleClick: (ctx) => {
                openSettingsOverlay(ctx);
                return true;
            },
            toolbar: nodeToolbar,
            Content: NodeContent,
        },
    ],
});
