# PS 节点（ps-node）

把画布（aigc-studio）和 Photoshop 连起来：画布生成的图推进 PS，PS 精修完再取回画布，形成闭环。

- 画布侧：`canvas-plugin/`（第三方画布插件，填 URL 安装）
- PS 侧：`ps-uxp/`（Photoshop UXP 插件，开发者模式加载）
- 中继：`aigc-studio/electron/ps-relay.cjs`（宿主 Electron 主进程内置，零依赖 HTTP 长轮询）

```
画布插件（PS 节点）  ⇄  中继 http://127.0.0.1:23310  ⇄  Photoshop UXP 面板
```

设计决策与完整协议见 [docs/decisions.md](docs/decisions.md)。

---

## 目录结构

```
ps-node/
├── canvas-plugin/          # 画布插件源码（TypeScript + esbuild）
│   ├── src/                # index.tsx / ui.tsx / actions.ts / relay.ts / ps-requests.ts
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
| Node.js 20+ | 构建画布插件、跑中继 |
| 画布宿主 `aigc-studio` | **需要 ps-relay 分支**：`feat/image-edit`（含 `electron/ps-relay.cjs`） |
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

宿主启动时会自动在中继 `127.0.0.1:23310` 起服务，并把 `{ url, token }` 注入页面 `window.__RUNTIME_CONFIG__.psRelay`。

> 纯浏览器开发态如果没跑 Electron 宿主，也可以单独起中继：
> `node electron/ps-relay.cjs --port 23310`
> 这样 token 为空（仅本机调试用）。

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

## 三、安装画布插件

画布右上「节点插件」→ 第三方插件 → 粘贴 JS 文件 URL → 安装。

方式 A：公网（推荐，别的机器直接用）

```
https://cdn.jsdelivr.net/gh/wangming123456456/ps-node@v0.1.9/dist/ps.js
```

方式 B：本地静态服务（改了源码后用这个）

```powershell
cd ps-node
node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{const p=path.join('dist',(req.url||'/').split('?')[0]);fs.readFile(p,(e,d)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':'application/javascript','access-control-allow-origin':'*'});res.end(d)})}).listen(8017)"
# 画布安装 URL 填：http://localhost:8017/ps.js
```

安装后在画布「扩展节点 → Photoshop」新建 PS 节点，或者从已有节点复制。

---

## 四、配置画布 AI（生图必需）

画布右上「配置」→ 渠道 → 填 Base URL + API Key，确认默认模型支持生图（如 `gpt-image-2`）。

没配 Key 时：图片节点生成、PS 面板「渲染」都会报 `AI 配置未就绪`；推送/取回/发送/接收这些传输功能不受影响。

---

## 五、使用：闭环工作流

### 画布侧 PS 节点

| 操作 | 作用 |
|---|---|
| 目标文档 | 推送到哪个 PS 文档；默认「跟随当前文档」 |
| 输出尺寸 | 取回时的最长边（1024 / 1536 / 2048 / 原图） |
| 推送 | 把上游生成图（没有则用节点自身内容）贴进 PS 新图层 |
| 取回 | 把 PS 当前文档画面拉回节点内容 |

### PS 面板「画面」页

| 操作 | 作用 |
|---|---|
| 画面缩略图 | 当前 PS 文档拼合图；切换文档/图层变化自动刷新，也可「刷新预览」 |
| 发送到画布 | 把当前 PS 画面同步到画布的 PS 节点 |
| 从画布接收 | 把画布 PS 节点里的图贴进 PS 新图层 |

### PS 面板「配置」页

| 操作 | 作用 |
|---|---|
| AI 生成 | 选模型、写提示词、参考当前画面、渲染；结果出现在「画面」页的「生成结果」卡，点「添加到图层」 |
| 选区局部重绘 | PS 里先框选区，再点渲染：自动裁选区当参考图，结果按选区框缩放贴回 |
| 日志 | 排查用，包含「回退副本导出」等提示 |
| 中继地址 | 改 url/token 后「应用并重连」 |

### 两种循环

**画布发起**
```
图片节点生成/改图 → 连线到 PS 节点 → 推送 → PS 手动修 → 取回 → 再连线图片节点…
```

**PS 发起**
```
PS 手动修 → 发送到画布 → 画布图片节点改 → 推送（或 PS「从画布接收」）
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
npm run build        # 产物 dist/ps.js，并同步一份到宿主 web/public/plugins/ps.js
```

PS 插件是原生 JS，没有构建步骤。改完 `ps-uxp/` 后：

```powershell
.\scripts\install-uxp.ps1
```

**必须重启 Photoshop**（UXP 只在启动/首次打开面板时加载插件脚本）。

中继单独调试：

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
| 画布节点「未连接」 | 画布插件要在宿主里跑（有 `window.__RUNTIME_CONFIG__.psRelay`），纯浏览器调试时手动填中继地址 |
| 推送报「文档不存在」 | 目标文档被关/改名；会自动退回当前文档，或重新选目标文档 |
| 渲染报「AI 配置未就绪」 | 画布配 AI Key / 默认模型 |
| 点发送 PS 闪屏 | 旧版本用复制文档导出；v0.1.9 起走 Imaging API，不再闪。若仍闪，看 PS 面板「配置→日志」是否有「回退副本导出」 |
| 面板按钮点不动 | 确认是最新部署（重启 PS）；看 UXP 日志 `%APPDATA%\Adobe\Adobe Photoshop 2024\Logs\UXPLogs*` |
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
