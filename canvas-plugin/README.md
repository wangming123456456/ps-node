# 画布插件（canvas-plugin）

AIGC 画布的「Photoshop」节点。产物是单个 ESM：`dist/ps.js`，通过插件市场的「第三方插件」填 URL 安装。

## 结构

```
src/index.tsx    节点声明（id=ps，节点 type=ps:layer）
src/ui.tsx       节点内容 / 面板 / 工具栏
src/actions.ts   推送 / 取回 / AI 优化 三个动作
src/relay.ts     中继客户端（HTTP 长轮询）
sdk/             @infinite-canvas/plugin-sdk（从宿主仓库同步，见下）
```

## 开发

```bash
npm install
npm run build      # 产物同步到仓库根 dist/ps.js
npm run dev        # watch
npm run typecheck
```

中继地址和 token 由宿主通过 `window.__RUNTIME_CONFIG__.psRelay` 注入；纯浏览器开发时在节点面板的「中继设置」里手填。

## 同步 SDK

SDK 的唯一真源是宿主仓库的 `plugins/canvas/sdk`。宿主契约变更后，把该目录的文件整份拷回本目录的 `sdk/`（不含 `node_modules`、`package-lock.json`），再跑一次 `npm run typecheck`。
