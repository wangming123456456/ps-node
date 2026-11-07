# PS 节点（ps-node）

在 AIGC 画布上放一个「Photoshop」节点：把画布里的图推进 PS，人在 PS 里精修，然后一键取回或 AI 优化后贴回 PS 新图层、同步回画布。

## 组成

```
画布插件（canvas-plugin/）                    PS UXP 插件（ps-uxp/）
        │  HTTP 长轮询，localhost + token            │
        └──────────────→ 宿主内置中继 ←──────────────┘
                    （aigc-studio/electron/ps-relay.cjs）
```

中继放在宿主（AIGC 画布 Electron 主进程）里，用户不需要单独启动进程；画布插件和 PS 插件都只作为客户端连接它。

## 目录

```
canvas-plugin/          画布插件（TypeScript，产物 dist/ps.js）
  src/{index,actions,relay,ui}.tsx
  sdk/                  从 aigc-studio 同步的 @infinite-canvas/plugin-sdk（保证本仓库可独立构建）
ps-uxp/                 Photoshop UXP 插件（manifest + 面板 + 中继客户端）
docs/
  decisions.md          v0.2 架构决策 + 中继协议（最新，先看这个）
  规划-v0.1.md / 设计-v0.1.md   最初草案（COM 桥路线，部分内容已被 decisions 取代）
```

## 安装

**画布插件**（插件市场 → 第三方插件 → 填 URL）：

```
https://cdn.jsdelivr.net/gh/wangming123456456/ps-node@<tag>/dist/ps.js
```

现在还没有打 tag；开发阶段可临时用 `@main`（jsDelivr 对 `@main` 有缓存，更新不即时，正式安装请等首个 tag）。

**PS 插件**：UXP Developer Tool → Add Plugin → 选 `ps-uxp/manifest.json` → Load。分发给别人需要打包 `.ccx` 并做 Adobe 签名。

## 开发

画布插件：

```bash
cd canvas-plugin
npm install
npm run build      # → dist/ps.js
npm run dev        # watch
npm run typecheck
```

PS 插件：用 UXP Developer Tool 加载 `ps-uxp/` 目录。

## 当前状态

阶段 0：仓库骨架。

- 已完成：目录结构、SDK 拷贝、画布插件骨架（节点 UI / 面板 / 中继客户端 / 三个动作）、UXP 面板骨架（连接与长轮询）、中继协议草案；画布插件 `npm run build` 与 `npm run typecheck` 均已通过，产物 `dist/ps.js` 已提交。
- 未完成：宿主中继实现（在 aigc-studio 仓库）、两端 `push` / `pull` 的 PS 真实现、真机验证。

## 文档

- [docs/decisions.md](docs/decisions.md)：架构决策、中继协议、待验证清单
- [docs/规划-v0.1.md](docs/规划-v0.1.md)、[docs/设计-v0.1.md](docs/设计-v0.1.md)：最初草案（历史版本）
