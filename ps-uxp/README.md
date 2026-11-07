# PS UXP 插件（ps-uxp）

Photoshop 侧的 UXP 面板：连接宿主内置中继，接收画布发来的命令。

## 已在真机验证（PS 25.0.0.37 / Windows 11）

- `docs`：列出打开的文档、尺寸、图层名。
- `push`（`newDoc`）：base64 PNG → 临时文件 → `batchPlay open` → 新文档。
- `push`（`layer`）：`batchPlay placeEvent`（session token）→ 新智能对象图层 → 改名为指定图层名；不改动既有图层。
- `pull`：副本上 CMYK→RGB、16→8 位、`flatten`、按 `maxEdge` 缩放、`saveAs.png`，最后 `closeWithoutSaving`；**原文档不被弄脏**。
- 错误路径：文档不存在时返回中文错误，PS 不弹错误框。

## 安装（当前阶段）

UXP Developer Tool 不是必须的：PS 会自动加载
`%APPDATA%\Adobe\UXP\Plugins\External\<任意名>_PS\` 下的插件。

1. 把本目录内容拷到 `%APPDATA%\Adobe\UXP\Plugins\External\psnode_PS\`。
2. 重启 Photoshop。
3. 打开一次面板：菜单「增效工具 → PS 节点」。**UXP 插件的主脚本要等面板第一次打开才执行**，之后会自动连中继（默认 `http://localhost:23310`，中继允许本机 PS 免 token）。

对外分发时再打包成 `.ccx` 并做 Adobe 签名。

## manifest 约束（实测）

- 必须 `manifestVersion: 6`，`host` 是对象：`{ "app": "PS", "minVersion": "23.0.0" }`（v5 + 数组形式会被拒：`Expected the host attribute to be an object`）。
- panel entrypoint 需要带 `icons`。
- `requiredPermissions.network.domains: ["http://localhost/"]` 就够用（端口不写进 domains）；用 `127.0.0.1` 会被权限拒绝。
- 中文名/文案要求 manifest 是 UTF-8，用 ASCII 写入会把「PS 节点」变成「PS ???」。

## 中继配对

PS 侧请求不带 `Origin`，中继对 `/api/next`、`POST /api/result` 只要求「无 Origin 且来自本机」，因此 PS 面板不用填 token 就能连。画布侧仍然要 token + Origin 白名单。

## 现状

- 已完成并实测：连接、长轮询、`docs` / `push` / `pull`、错误回填。
- 待做：面板里的「连接/读取文档」按钮体验（目前连接是自动的）、图层选择 UI、多文档切换。
