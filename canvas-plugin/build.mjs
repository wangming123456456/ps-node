// 产物名固定为 ps.js，输出到仓库根 dist/（jsDelivr 直接引用 dist/ps.js）。
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildPlugin } from "@infinite-canvas/plugin-sdk/build";

const root = dirname(fileURLToPath(import.meta.url));

await buildPlugin(import.meta.url, { name: "ps", publicDir: join(root, "..", "dist") });
