# PS 节点 · 架构决策与协议（v0.2）

> 取代 `规划-v0.1.md` / `设计-v0.1.md` 中与本文冲突的部分。v0.1 的 COM 桥路线已放弃。

## 决策

| 编号 | 决策 | 理由 | 代价 |
|---|---|---|---|
| D1 | 画布侧做插件，PS 侧做 **UXP 插件** | 面板可以放在 PS 里，人在 PS 精修时不用切回画布；图层级能力（batchPlay）后续可扩展 | UXP 需要 Developer Tool 开发、分发需签名 |
| D2 | 中转做进**宿主 Electron 主进程** | 用户不用单独启动进程，体验上就是「两个插件联通」 | 要改宿主仓库；纯浏览器开发态没有中继 |
| D3 | 中转用**零依赖 HTTP 长轮询**（`node:http`） | 宿主打包白名单只包含 `electron/` 与 `web/dist/`，加 `ws` 依赖需要改打包配置；长轮询两端都能用 fetch 实现，延迟毫秒级 | 不是真 WebSocket；超长连接需要自己保活 |
| D4 | 画布插件按**第三方插件（填 URL）**分发 | jsDelivr 直接引用 tag 产物，升级只要改 tag | 仓库必须公开 |
| D5 | AI 优化用宿主的 `ctx.ai.generateImage`，ComfyUI **不参与 v1** | 少一个常驻进程、少约 300 行工作流代码；宿主已管好模型和密钥 | 想用本地工作流（LoRA/ControlNet）要等后续版本 |
| D6 | 插件清单、token 通过宿主注入的 `window.__RUNTIME_CONFIG__.psRelay` 下发 | 宿主已有 runtime config 机制，不需要额外 IPC | 纯浏览器开发时需要手动填地址/token |
| D7 | 只保留固定原子命令（`docs` / `push` / `pull`），不提供任意脚本执行端点 | 中继等价于本地操作 PS 的能力，且中继对本地网页开放 | 扩展能力要改代码而不是发任意脚本 |
| D8 | 安全默认值：只绑 `127.0.0.1`、token 必填、画布侧校验 Origin | 中继可以驱动 PS，风险面必须收敛 | 多一次复制 token 的手工步骤 |

## 中继协议（草案 v0.1）

- 地址：`http://localhost:23310`（端口固定，冲突时改常量）
- 鉴权：除 `/api/health` 外，请求头必须带 `X-Relay-Token`
- 编码：JSON；图片统一 `data:image/png;base64,...`

### 端点

| 端点 | 方向 | 说明 |
|---|---|---|
| `GET /api/health` | 任意 | `{ ok, version, photoshop: { connected, doc } }` |
| `GET /api/next?timeout=25000` | PS → 中继 | 长轮询取一条命令；超时返回 `204` |
| `POST /api/command` | 画布 → 中继 | 请求 `{ command, payload, timeoutMs? }`，返回 `{ id }`（命令排队） |
| `GET /api/result?id=&timeout=25000` | 画布 → 中继 | 长轮询取命令结果；超时返回 `204` |
| `POST /api/result` | PS → 中继 | 回填 `{ id, ok, data }` 或 `{ id, ok: false, error }` |

### 命令

| command | 请求 payload | 返回 data |
|---|---|---|
| `docs` | `{}` | `{ docs: [{ name, width, height }] }` |
| `push` | `{ image, mode: "newDoc" \| "layer", doc, layerName }` | `{ doc, layer?, width?, height? }` |
| `pull` | `{ doc?, maxEdge? }` | `{ image, doc, width?, height? }` |

- 图片单张上限 8 MB（base64），超出返回错误；`maxEdge` 默认 2048。
- `push` 的 `layer` 模式只新增图层，不替换、不删除任何既有图层。

## 宿主侧（aigc-studio）

- 新增 `electron/ps-relay.cjs`：中继实现，可被 `main.cjs` 启动，也可 `node electron/ps-relay.cjs --port 23310` 独立运行（纯浏览器开发态兜底）。
- `main.cjs`：`app.whenReady` 后启动中继；`app://` 协议对 `/config.js` 注入：

```js
window.__RUNTIME_CONFIG__ = window.__RUNTIME_CONFIG__ || {};
window.__RUNTIME_CONFIG__.psRelay = { url: "http://localhost:23310", token: "..." };
```

- token 首次启动生成 32 位 hex，存 `userData`，画布面板可见，PS 面板粘贴一次。

## 待验证清单（真机）

- [x] 中继协议（画布投递/PS 领取/结果回填/长轮询唤醒/超时 204/鉴权/Origin 白名单）——用 Node 自测脚本跑过，全通过
- [ ] UXP `manifest.json` 的 `requiredPermissions.network.domains` 用 `http://localhost/` 能放行中继（端口不写进 domains）
- [ ] UXP fetch 对 `http://localhost:23310` 的超时/中断行为（`AbortController`）
- [ ] PS 25.0 上 `batchPlay` 的 `placeEvent` 用 session token 放置 PNG（写临时文件 → `createSessionToken` → `_path`）
- [ ] 导出整幅：副本 + flatten + resize + `saveAs.png`，且不弄脏用户文档
- [ ] 大图（2048 边长）base64 在 UXP ↔ 中继 ↔ 画布之间往返的体积与耗时
- [ ] 中继进程与 PS 断开后的重连（长轮询超时 + 退避）
- [ ] 宿主打包后中继仍可用（产物在 `electron/` 内，不需要额外依赖）

## 分发

- 画布插件：`npm run build` → `dist/ps.js` 提交 + 打 tag → `https://cdn.jsdelivr.net/gh/wangming123456456/ps-node@<tag>/dist/ps.js`
- PS 插件：UXP Developer Tool 开发加载；对外分发时打包 `.ccx` 并签名（Adobe 账号）
