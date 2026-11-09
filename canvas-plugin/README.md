# 画布插件（canvas-plugin）

AIGC 画布的「Photoshop」节点。产物是单个 ESM：`dist/ps.js`，通过插件市场的「第三方插件」填 URL 安装。

## 结构

```
src/index.tsx       节点声明（id=ps，节点 type=ps:layer）
src/ui.tsx          节点内容 / 工具栏
src/settings.ts     设置浮层（目标文档 / 输出尺寸 / 中继状态）
src/actions.ts      推送 / 取回
src/node-actions.ts 任意图片节点右键菜单动作
src/relay.ts        中继客户端（HTTP 长轮询，地址/token 只读宿主注入）
src/ps-requests.ts  PS 面板反向请求（生成 / 模型列表）
sdk/                @infinite-canvas/plugin-sdk（从宿主仓库同步，见下）
```

## 开发

```bash
npm install
npm run build      # 产物同步到仓库根 dist/ps.js
npm run dev        # watch
npm run typecheck
```

## UI 约定

- 视觉遵循宿主 `aigc-studio/AGENTS.md` 的「画布 UI 规范」：扁平、无边框阴影、按钮透明底 + hover、状态用圆点。
- 颜色只从 `ctx.theme` 取：`ui.tsx` / `settings.ts` 把 `theme.node.*` / `theme.toolbar.*` 写成 CSS 变量（`--ps-text/--ps-muted/--ps-hover/...`），样式在 `src/styles.css`，不在 JSX 里硬编码颜色。
- 设置浮层：目标文档下拉（跟随当前文档/指定文档）+ maxEdge 输出尺寸 + 中继状态（只读地址 + 测试连接，不提供手填）。
- 节点卡片：图片/空态、状态点与文案、运行中耗时、底部 `文档名 · 图层名`、错误一行红字。

## 同步 SDK

SDK 的唯一真源是宿主仓库的 `plugins/canvas/sdk`。宿主契约变更后，把该目录的文件整份拷回本目录的 `sdk/`（不含 `node_modules`、`package-lock.json`），再跑一次 `npm run typecheck`。
