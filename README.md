 PS 节点（ps-node）

把画布（aigc-studio）和 Photoshop 连起来：画布生成的图推进 PS，PS 精修完再取回画布，形成闭环。

- 画布侧：`canvas-plugin/`（第三方画布插件，填 URL 安装）
- PS 侧：`ps-uxp/`（Photoshop UXP 插件，开发者模式加载）
- 中继：由 `aigc-studio` 的 canvas-agent 托管（复用 `electron/ps-relay.cjs`，零依赖 HTTP 长轮询）

```
画布插件（PS 节点）  ⇄  中继 http://127.0.0.1:23310  ⇄  Photoshop UXP 面板
```

设计决策与完整协议见 [docs/decisions.md](docs/decisions.md)。

**第一次装？** 看 [docs/安装说明.md](docs/安装说明.md)——新手版，从零开始，每一步都写了该看到什么、不对该查哪。下面几节是给已经装过、要改代码的人看的。

---

## 目录结构

```
ps-node/
├── canvas-plugin/          # 画布插件源码（TypeScript + esbuild）
│   ├── src/                # index.tsx / ui.tsx / settings.ts / actions.ts / node-actions.ts / relay.ts / ps-requests.ts
│   └── dist/ps.js          # 构建产物，也是画布安装用的插件文件
├── ps-uxp/                 # Photoshop UXP 插件（原生 JS，无构建）
│   ├── manifest.json
│   ├── index.html          # 面板 UI（画面 / 配置 两个标签页）
│   └── main.js             # 中继客户端 + PS 操作
├── docs/decisions.md       # 架构决策 + 中继协议
├── scripts/install-uxp.ps1 # 一键部署 PS 插件到本机 UXP 目录
└── README.md
```

---

## 前置要求

| 依赖 | 说明 |
|---|---|
| Windows + Photoshop 2024（25.0+） | 低版本 UXP API 不全，未验证 |
| Node.js 20+ | 构建画布插件 |
| 画布宿主 `aigc-studio` | **需要 `feat/image-edit` 分支**（含 canvas-agent 托管的中继与 `nodeActions`） |
| 画布 AI Key | 生图/渲染需要，在画布「配置」里填 |

---

## 一、准备画布宿主（aigc-studio）

```powershell
git clone https://github.com/wangming123456456/aigc-studio.git
cd aigc-studio
git checkout feat/image-edit
npm install
npm run dev          # 浏览器开发态，默认 http://localhost:3000
```

画布打开时 canvas-agent 会自动拉起中继（`127.0.0.1:23310`），并把 `{ url, token }` 注入页面 `window.__RUNTIME_CONFIG__.psRelay`；插件只读这份注入，不再有手填地址/token 的入口。

> 中继由 canvas-agent 托管，不需要单独启动；agent 没跑时 PS 节点设置里的「中继」会显示「未注入」。

---

## 二、安装 Photoshop UXP 插件

UXP 第三方插件没有签名安装包，走「开发者模式 + 手动放目录」：

1. 打开 UXP 开发者模式，创建/确认这个文件：

   `C:\Program Files\Common Files\Adobe\UXP\Developer\settings.json`
   ```json
   { "developer": true }
   ```

2. 把本仓库的 `ps-uxp/` 拷到 UXP 外部插件目录（文件夹名随意，**建议 `<任意8位id>_PS`**）：

   ```powershell
   # 本机运行（会自动创建目录并复制）
   .\scripts\install-uxp.ps1
   ```

   等价手动操作：
   ```powershell
   $dest = "$env:APPDATA\Adobe\UXP\Plugins\External\a1b2c3d4_PS"
   New-Item -ItemType Directory -Force -Path $dest | Out-Null
   Copy-Item .\ps-uxp\* $dest -Recurse -Force
   ```

3. 重启 Photoshop。

4. 菜单 **增效工具 → PS 节点** 打开面板。**第一次必须手动打开一次面板**，插件脚本才会启动并自动连接中继。

---

## 三、画布侧不用装插件

PS 能力在 v0.3 起**内置到画布的图片卡片**（`aigc-studio` 分支 `feat/image-edit` 起）：

- 任意图片卡片的工具条有「推送到 PS / 从 PS 取回」，跟着「更多 → 自定义工具栏」可隐藏、可排序；
- 选中的卡片会自动出现在 PS 面板预览区（选中即预览），点面板里的画面才落层；
- 全局设置在「配置 → PS 节点」：取回尺寸、中继状态、测试连接。

**旧画布（v0.3 之前）** 才需要装画布插件：`节点插件 → 第三方插件` 粘
`https://cdn.jsdelivr.net/gh/wangming123456456/ps-node@v0.2.0/dist/ps.js`。
v0.2.0 已是退场版——只渲染旧节点并提示改用图片卡片，不再注册可创建的节点。

> 仓库里的 `canvas-plugin/` 只剩这个退场渲染器（约 2KB）；`ui` / `actions` / `relay` / `ps-requests` / `settings` 这些旧实现已删除。

---

## 四、配置画布 AI（生图必需）

画布右上「配置」→ 渠道 → 填 Base URL + API Key，确认默认模型支持生图（如 `gpt-image-2`）。

没配 Key 时：图片节点生成、PS 面板「渲染」都会报 `AI 配置未就绪`；推送/取回/发送/接收这些传输功能不受影响。

---

## 五、使用：闭环工作流

### 画布侧：图片卡片

选中任意图片卡片，PS 面板就会显示它（选中即预览）。卡片工具条上有两个 PS 动作，跟其它图片工具一样能在「更多 → 自定义工具栏」里隐藏或排序：

| 操作 | 作用 |
|---|---|
| 推送到 PS | 把这张图推进 PS 新图层（有选区时贴回选区） |
| 从 PS 取回 | 把 PS 当前画面（有选区取选区）写回这张卡，等同面板上的「发送画布」 |

全局设置在「配置 → PS 节点」：

| 设置项 | 作用 |
|---|---|
| 取回尺寸 | 从 PS 取回 / 发送画布时的最长边（1024 / 1536 / 2048 / 原图） |
| 中继 | 只读显示宿主注入的地址，可测试连接；不提供手填 |

画布上的修图工具（裁剪、局部蒙版、放大、标注、去背、消除、调色、重打光…）结果都写回卡片本身，改完再「推送到 PS」接着修。

### PS 面板：取景器 + 两个动作

- **落层**：点面板里的画面，按 PS 当前选区落成图层（没有选区就新增一层）；
- **发送画布**：把 PS 当前画面写回画布上选中的卡片，状态行会显示将写回哪张。

选中视频 / 音频 / 文本卡片时只提示「PS 不支持」，**不会把上一张画面清空**。

### PS 面板（单面板：绘图视图 + 设置视图）

顶部右上角「⚙ 设置」进入设置视图，设置视图左上角「‹ 返回」回到绘图视图。

**绘图视图**

| 区域 | 作用 |
|---|---|
| 状态 / 文档行 | 中继连接状态、当前文档信息、刷新（同时刷新预览） |
| 画面预览 | 跟随「参考 / 结果」开关：参考=当前 PS 画面（有选区只显示选区），结果=AI 生成图；点结果画面直接落成 PS 图层 |
| 预览开关 | 「参考」显示当前 PS 图层画面（选区时只显示选区内容）；「结果」只显示 AI 生成返回的图 |
| AI 生成 | 模型下拉 + 提示词 + 参考当前画面 + 渲染（模型/Key 用画布那份配置） |
| 选区局部重绘 | PS 里先框选区再渲染：自动裁选区当参考图，结果按选区框贴回 |

**设置视图**

| 分组 | 参数 / 开关 |
|---|---|
| 连接 | 中继地址、Token、测试连接、应用并重连 |
| 生成 | 默认模型、默认参考当前画面、渲染后自动添加到图层 |
| 预览 | 预览最长边（512 / 1024 / 2048）、自动刷新预览 |
| 日志 | 历史日志、清空日志 |
| 关于 | 版本信息 |

设置项存在本地（localStorage），主面板每 3 秒重读一次，改完即生效。

### PS 面板 UI 规范

参考 ComfyUI Settings 风格，两视图共用一套 token：

| 项目 | 规格 |
|---|---|
| 层级配色 | 窗口 `#333` > 卡片 `#262626` > 控件 `#1b1b1b`（越往里越深，无边框） |
| 间距 | 卡片间距 12 / 页面内边距 12 / 卡片内边距 16 / 卡片内行距 12 / 标签-控件 6 |
| 控件 | 输入/下拉/文本域高 38、圆角 10；按钮高 38、圆角 10；复选框 18 |
| 圆角 | 卡片 14、预览 14 |
| 字号 | 卡片标题 14（右 meta 11 灰）/ 控件 13 / 标签 12 / 提示 11 |
| 分段控件 | 整行三等分、选中白底 |

UXP（PS 25.0）实测注意点：

- 纵向间距一律用 `margin`：`.app`/卡片里的 flex `gap` 在纵向会随机失效，别依赖它。
- 原生 `<button>` 自带 8px margin 与偏大的默认宽高，需要 `button { margin: 0 }` 再显式定高。
- 原生 `<select>` 的外观无法用 CSS 覆盖（会盖在 DOM 之上且忽略 opacity），因此 select 只存值并 `display: none`，外观与弹出菜单由 JS 自绘（`.picker__*` / `.picker-menu__*`）。
- `input`/`textarea` 需要 `appearance: none` 才能去掉 UXP 自绘边框和内阴影，圆角、底色才干净。
- `<button>` 在 UXP 里不渲染子元素，开关的 thumb 必须用 `<div>` + 绝对定位实现，不能用 `transform`。
- 原生表单控件（input/textarea/select）会盖在普通 DOM 之上，弹出层不能和它们重叠。

画布同步入口统一在画布侧（PS 节点 推送/取回、任意图片右键），PS 面板不再提供「发送到画布 / 从画布接收」。

> 历史：曾尝试用 UXP 多面板做成两个独立窗口，实际在该 PS/UXP 版本下设置面板会空白或内容串到绘图面板，因此回退为单面板内切换视图。

### 两种循环

**画布发起**
```
图片节点生成/改图 → 连线到 PS 节点 → 推送 → PS 手动修 → 取回 → 再连线图片节点…
```

**PS 发起**
```
PS 手动修 → 切到画布：PS 节点点「取回」，或图片节点右键「从 PS 取回」
```

---

## 六、中继协议（摘要）

完整版见 [docs/decisions.md](docs/decisions.md)。

- 监听：`127.0.0.1:23310`
- 鉴权：画布侧端点要 `X-Relay-Token` + Origin 白名单（`app://local` / `localhost` / `127.0.0.1`）；PS 侧无 Origin，免 token
- 画布→PS：`POST /api/command`、`GET /api/next`、`POST /api/result`、`GET /api/result`
- PS→画布：`POST /api/ps/request`、`GET /api/ps/next`、`POST /api/ps/result`、`GET /api/ps/result`
- 图片统一 dataURL（PS 侧导出为 JPEG，白底合成；画布侧生成图为 PNG/JPEG 均可）

命令：

| 方向 | 命令 | 说明 |
|---|---|---|
| 画布→PS | `docs` | 文档列表 |
| 画布→PS | `selection` | 当前选区 bounds |
| 画布→PS | `push` | 图片贴成 PS 新图层 / 新文档 |
| 画布→PS | `pull` | 导出 PS 当前画面 |
| PS→画布 | `models` | 画布 AI 模型列表 |
| PS→画布 | `generate` | 画布宿主 AI 生成（可带参考图/选区） |
| PS→画布 | `latest` | 取画布 PS 节点当前图 |
| PS→画布 | `sync` | PS 画面写回画布节点 |

---

## 七、开发

画布插件：

```powershell
cd canvas-plugin
npm install
npm run typecheck
npm run build        # 产物 dist/ps.js
node ..\scripts\sync-canvas-plugin-cache.mjs   # 已装过插件时，把新产物同步进画布市场的缓存
```

> 画布只读插件市场里的缓存源码，光更新 `dist/ps.js` 不会生效：构建后在仓库根目录跑一次 `node scripts\sync-canvas-plugin-cache.mjs`（读 agent 配置里的 `canvasRoot`，自动备份），再刷新画布页。

PS 插件是原生 JS，没有构建步骤。改完 `ps-uxp/` 后：

```powershell
.\scripts\install-uxp.ps1
```

**必须重启 Photoshop**（UXP 只在启动/首次打开面板时加载插件脚本）。

中继单独调试（只调 PS 侧协议，画布插件不会读这个地址，联调仍要 agent 注入）：

```powershell
node electron/ps-relay.cjs --port 23310 --token devtoken
```

### 调试要点（踩过的坑）

- UXP 面板脚本只在**首次打开面板**时执行，之后改代码要重启 PS 或重开面板。
- PS 侧 `imaging.getPixels` 必须在 `core.executeAsModal(...)` 里调用，否则报 modal scope 错误。
- `imaging.getPixels` 返回带 alpha 时不能直接 JPEG 编码，要传 `applyAlpha: true` + `componentSize: 8`。
- 不要用 `document.duplicate()` 导出画面：会短暂弹出文档窗口（用户看到"闪屏"）。用 Imaging API。
- 面板 `<section hidden>` 会被自定义 `display:flex` 覆盖，需要全局 `[hidden]{display:none!important}`。
- UXP 里多面板共用一个 `main` HTML（manifest 的 `main` 只能一个），所以面板内用标签页分「画面 / 配置」。
- 上传给 PS 的临时文件按 dataURL mime 决定扩展名（jpg/png），别一律写 `.png`。

---

## 八、故障排查

| 现象 | 处理 |
|---|---|
| PS 面板「未连接」 | 确认宿主/中继在跑（`curl http://127.0.0.1:23310/api/health`）；面板首次要手动打开；配置页改地址后点「应用并重连」 |
| 画布节点「未连接」 | 确认 canvas-agent 在跑（画布打开时会自动拉起中继并注入 `window.__RUNTIME_CONFIG__.psRelay`），然后刷新页面；旧版本手填过的 token 不再读取 |
| 推送报「文档不存在」 | 目标文档被关/改名；会自动退回当前文档，或重新选目标文档 |
| 渲染报「AI 配置未就绪」 | 画布配 AI Key / 默认模型 |
| 点发送 PS 闪屏 | 旧版本用复制文档导出；v0.1.9 起走 Imaging API，不再闪。若仍闪，看 PS 面板「配置→日志」是否有「回退副本导出」 |
| 面板按钮点不动 | 确认是最新部署（重启 PS）；看 UXP 日志 `%APPDATA%\Adobe\Adobe Photoshop 2024\Logs\UXPLogs*` |
| 重启 PS 后「增效工具 → PS 节点」不见了 | UXP 的用户插件表 `%APPDATA%\Adobe\UXP\PluginsInfo\v1\PS.json` 一旦存在，PS 就不扫描 External 目录；PS 会把它写成空表 `{"plugins":[]}`。删掉它（或换成同名目录）再重启 PS；`scripts/install-uxp.ps1` 会自动处理这一步。 |
| Photoshop 打不开/进程残留 | 任务管理器结束 `Photoshop.exe` 再启动；系统内存紧张时先关掉多余文档 |
| 端口 23310 被占 | 中继会自动 +1 试绑；也可改宿主里的默认端口常量 |

---

## 九、已知限制

- **没有签名安装包**：PS 插件只能开发者模式手动放目录，不能双击安装。
- **画布插件要能访问 URL**：本地调试用 8017 静态服务；公网用 jsDelivr tag 地址。
- 取回/发送的图是 JPEG（透明底会被白底合成），需要透明通道的后续再加 PNG 编码支持。
- 多 PS 节点同时存在时，PS 面板的请求由"谁先领到谁处理"，并把结果写回那个节点；单 PS 节点场景没问题。
- 未做 UXP 面板尺寸/停靠记忆，面板布局由 Photoshop 自己保存。

---

## 十、仓库

- ps-node：https://github.com/wangming123456456/ps-node （公开）
- 宿主：https://github.com/wangming123456456/aigc-studio ，分支 `feat/image-edit`
