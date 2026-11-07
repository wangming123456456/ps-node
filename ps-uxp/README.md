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

已实现：连接中继、长轮询收命令、`docs`（列出文档）、错误回填。

未实现（下一步）：

- `push`：base64 → 临时 PNG → `fs.createSessionToken` → `batchPlay` 的 `placeEvent` → 把新图层改名；只新增图层，不碰既有图层。
- `pull`：复制文档 → `flatten` → 按 `maxEdge` `resizeImage` → `saveAs.png` → 读回字节 → base64；最后 `close(SaveOptions.DONOTSAVECHANGES)`，不弄脏用户文档。
- 以上 PS 修改都要包在 `core.executeAsModal` 里，并设置 `app.displayDialogs = DialogModes.NO` 再还原。
- 大图（2048 边长）的 base64 体积与耗时要在真机压测。
