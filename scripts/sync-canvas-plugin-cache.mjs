// 把本仓库 dist/ps.js 同步进画布市场的插件缓存（画布只读缓存源码，光改 dist 不会生效）。
// 用法：node scripts/sync-canvas-plugin-cache.mjs
// 画布根目录取 ~/.infinite-canvas/canvas-agent.json 的 canvasRoot。
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const bundleFile = path.join(root, "dist", "ps.js");
const agentConfigFile = path.join(os.homedir(), ".infinite-canvas", "canvas-agent.json");

if (!fs.existsSync(bundleFile)) {
    console.error(`找不到产物 ${bundleFile}，先 cd canvas-plugin && npm run build`);
    process.exit(1);
}
const config = JSON.parse(fs.readFileSync(agentConfigFile, "utf8"));
const canvasRoot = config.canvasRoot;
if (!canvasRoot) {
    console.error(`${agentConfigFile} 里没有 canvasRoot`);
    process.exit(1);
}
const storeFile = path.join(canvasRoot, ".state", "infinite-canvas_plugin_store.json");
if (!fs.existsSync(storeFile)) {
    console.error(`找不到插件缓存 ${storeFile}`);
    process.exit(1);
}

const json = JSON.parse(fs.readFileSync(storeFile, "utf8"));
const entry = json.state?.plugins?.find((plugin) => plugin.id === "ps");
if (!entry) {
    console.error("插件缓存里没有 id=ps 的记录，先在画布「插件市场」里安装一次");
    process.exit(1);
}

const bundle = fs.readFileSync(bundleFile, "utf8");
if (entry.source === bundle) {
    console.log("插件缓存已是最新，无需更新");
    process.exit(0);
}

const backup = `${storeFile}.bak-${Date.now()}`;
fs.copyFileSync(storeFile, backup);

entry.source = bundle;
entry.installedAt = new Date().toISOString();

const temp = `${storeFile}.tmp`;
fs.writeFileSync(temp, JSON.stringify(json), "utf8");
const check = JSON.parse(fs.readFileSync(temp, "utf8"));
if (!check.state.plugins.some((plugin) => plugin.id === "ps" && plugin.source === bundle)) {
    fs.rmSync(temp, { force: true });
    console.error("写回校验失败，插件缓存未改动");
    process.exit(1);
}
fs.renameSync(temp, storeFile);
console.log(JSON.stringify({ storeFile, backup, bytes: bundle.length }, null, 2));
