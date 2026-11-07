import { definePlugin } from "@infinite-canvas/plugin-sdk";

import css from "./styles.css";
import { NodeContent, NodePanel, nodeToolbar } from "./ui";

export default definePlugin({
    id: "ps",
    name: "PS 节点",
    version: "0.1.3",
    description: "把画布的图推进 Photoshop，改完再取回或 AI 优化",
    css,
    nodes: [
        {
            type: "ps:layer",
            title: "Photoshop",
            icon: "🎨",
            description: "画布发起、PS 落地：推送 / 取回 / AI 优化",
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
