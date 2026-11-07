# PS UXP 插件（ps-uxp）

Photoshop 侧的 UXP 面板：连接宿主内置中继，接收画布发来的命令。

## 权限

`manifest.json` 里只申请了必要的两项：

- `network.domains: ["http://localhost/"]`：访问本机中继。**用 `localhost` 而不是 `127.0.0.1`**——Adobe 论坛实测 IP 形式会被权限拒绝，端口不用写进域名。
- `localFileSystem: "request"`：后续 `push`/`pull` 需要写临时 PNG、读导出结果。

## 开发加载

1. 安装 Adobe **UXP Developer Tool**（本机还没装）。
2. 打开 PS → UXP Developer Tool → Add Plugin → 选本目录的 `manifest.json` → Load。
3. 面板出现在「增效工具」或窗口菜单里；填中继地址和 token 后点「连接」。

> 如果 UDT 报缺少图标，再补 `icons/` 并在 manifest 的 entrypoint 里加 `icons` 字段；当前版本先不阻塞开发。

## 现状

已实现：连接中继、长轮询收命令、错误回填、`docs`、`push`（`newDoc` 新建文档 / `layer` 贴成智能对象图层）、`pull`（副本上 flatten + 按 `maxEdge` 缩放 + `saveAs.png`，最后 `closeWithoutSaving`，不弄脏用户文档）。

**还没在真机跑过**（本机未装 UXP Developer Tool）。第一次加载后按这个顺序验：

1. 面板「连接」→ 应显示「已连接 · 中继在线」。
2. 「读取文档」→ 列出当前 PS 里打开的文档（验证 `app.documents`）。
3. 画布侧点「从 PS 取回」→ PS 里出现短暂副本后关闭，画布节点显示导出图（验证 duplicate/flatten/saveAs/close）。
4. 画布侧点「推送到 PS」→ 当前文档顶部出现新智能对象图层，名字是 `AI 优化 HH:mm`（验证 placeEvent + session token）。
5. 换成 CMYK / 16 位文档再取回一次，确认能导出（必要时先 `changeMode(RGB)` + `bitsPerChannel = EIGHT`）。
6. 大图（2048 边长）测一次耗时和 base64 体积。

已知风险点：`batchPlay` 的 `open` / `placeEvent` 用 session token 的形式、`resizeImage` 的尺寸语义、`saveAs.png` 在 CMYK 文档上的表现——这几处最可能需要按真机报错微调。
