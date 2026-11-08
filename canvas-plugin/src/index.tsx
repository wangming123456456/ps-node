import { definePlugin } from "@infinite-canvas/plugin-sdk";

import css from "./styles.css";
import { NodeContent, NodePanel, nodeToolbar } from "./ui";

export default definePlugin({
    id: "ps",
    name: "PS 节点",
    version: "0.1.11",
    description: "画布 ↔ Photoshop 通道：推送 / 取回，生成改图交给图片节点",
    css,
    nodes: [
        {
            type: "ps:layer",
            title: "Photoshop",
            icon: "🎨",
            description: "画布 ↔ PS 通道：推送 / 取回；生成改图用图片节点",
            defaultSize: { width: 340, height: 380 },
            defaultMetadata: { content: "", psStatus: "idle", psDoc: "", psLayer: "", psError: "", psStartedAt: 0 },
            minimapColor: "#31a8ff",
            autoOpenPanel: true,
            resource: (node) => {
                const url = typeof node.metadata?.content === "string" ? node.metadata.content : "";
                return url ? { kind: "image", url } : null;
            },
            onDoubleClick: (ctx) => {
                ctx.openPanel();
                return true;
            },
            toolbar: nodeToolbar,
            Content: NodeContent,
            Panel: NodePanel,
        },
    ],
});
