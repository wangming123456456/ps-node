# AGENTS.md

本仓库同时装两样东西：画布侧的 **PS 节点插件**（`canvas-plugin/`，产物 `dist/ps.js` 由画布直接加载）和 Photoshop 侧的 **UXP 面板**（`ps-uxp/`，手工放进 UXP 目录）。本文件约束 AI / 自动化开发行为；用户当前消息优先于本文件。

## 文档同步（最重要）

- `docs/安装说明.md` 是给**最终用户**的新手安装说明（从零装到跑通）；`README.md` 是给**改代码的人**看的开发、协议与发版说明。两份分工不同，不要合并。
- 任何会改变**安装步骤、界面入口或按钮文案、默认端口/地址、常见报错文案、版本号或 jsDelivr 地址**的改动，必须在**同一次改动里**一并更新 `docs/安装说明.md` 和 README 对应段落。不要留到下次「顺手补」。
- 改了 `ps-uxp/` 的面板 UI 或交互 → 检查安装说明里对面板的描述（状态文字、日志位置、预览落层方式）是否还对。
- 改了 `canvas-plugin/` 的节点工具条、设置浮层、中继逻辑 → 检查说明里的操作步骤（推送/取回/设置 的位置与名字）是否还对。
- 文档不要写过期日期；验收步骤要写成「做完应该看到什么」，而不是只写点哪里。

## 构建与产物

- 改完 `canvas-plugin/src/` 必须构建：`cd canvas-plugin && npm run build`，产物 `dist/ps.js`（含仓库根 `dist/`）要一起提交——画布装插件读的就是这个文件。
- 只改 `dist/ps.js` 不重新构建不算改代码；只构建不同步进画布插件缓存，用户那边看到的还是旧版。
- 改了 `ps-uxp/` 必须重新部署（`scripts/install-uxp.ps1`），并且**关掉再打开面板**或重启 PS 才生效。

## 本机坑（踩过的，别重犯）

- `%APPDATA%\Adobe\UXP\PluginsInfo\v1\PS.json` **必须保持为同名目录**。一旦变回文件，PS 重启后就不再扫描 External 目录，插件表现为「第一次能用、重启就消失」。`install-uxp.ps1` 会自动处理，不要手工改回文件。
- PowerShell 脚本保持**纯 ASCII**：`powershell -File` 走 5.1，UTF-8 无 BOM 的中文会按 ANSI 解码，直接语法错误。
- 中继 `127.0.0.1:23310` 由画布宿主的 canvas-agent 托管，地址/token 注入页面；PS 侧无 Origin 免 token。不要在画布插件里恢复手填地址/token 的入口。
- 健康检查 `/api/health` 的 `photoshop.connected` 是 15 秒窗口，PS 面板是 25 秒长轮询，中间会误报「未连接」，不要拿它当门禁。

## 发布

- 发版：升 `canvas-plugin/package.json`、`src/index.tsx` 里的 `version`，重新构建并提交 `dist/ps.js`，然后打 tag。
- 安装说明与 README 里的 jsDelivr 地址是**带 tag** 的，发版时要一起改；用 `@main` 的地址会命中 CDN 缓存，别图省事。
