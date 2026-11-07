// PS 侧：面板 + 中继客户端（HTTP 长轮询，零依赖）+ PS 操作实现。
// 协议见仓库根 docs/decisions.md。
//
// 实现依据（Adobe 官方 UXP Photoshop 文档）：
//   - Document.duplicate / flatten / resizeImage / saveAs.png / closeWithoutSaving
//   - batchPlay placeEvent / open，用 fs.createSessionToken 传本地文件
// 注意：本文件还没在真机（UXP Developer Tool）里跑过，见 README「待验证」。

const { entrypoints, storage } = require("uxp");
const { app, core, action, constants } = require("photoshop");

const fs = storage.localFileSystem;
const formats = storage.formats;

console.log("[ps-node] main.js loaded");

const RELAY_STORAGE_KEY = "ps-node:relay";
const POLL_TIMEOUT_MS = 25000;

const relay = { url: "http://localhost:23310", token: "" };
let polling = false;

// ---------------------------------------------------------------------------
// 小工具
// ---------------------------------------------------------------------------

function el(id) {
    return document.getElementById(id);
}

function messageOf(error) {
    if (!error) return "未知错误";
    if (typeof error === "string") return error;
    return error.message || String(error);
}

function log(line) {
    const node = el("log");
    if (!node) return;
    const time = new Date().toLocaleTimeString("zh-CN");
    node.textContent = `${time}  ${line}\n` + node.textContent;
}

function setStatus(connected, label) {
    const dot = el("dot");
    const status = el("status");
    if (dot) dot.className = connected ? "dot on" : "dot";
    if (status) status.textContent = label;
}

// ---------------------------------------------------------------------------
// base64（UXP 不保证有 btoa/atob，自己编解码）
// ---------------------------------------------------------------------------

const BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const BASE64_LOOKUP = (() => {
    const map = {};
    for (let i = 0; i < BASE64_ALPHABET.length; i += 1) map[BASE64_ALPHABET[i]] = i;
    return map;
})();

function bytesToBase64(bytes) {
    const parts = [];
    for (let i = 0; i < bytes.length; i += 3) {
        const a = bytes[i];
        const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
        const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
        const chunk =
            BASE64_ALPHABET[a >> 2] +
            BASE64_ALPHABET[((a & 3) << 4) | (b >> 4)] +
            (i + 1 < bytes.length ? BASE64_ALPHABET[((b & 15) << 2) | (c >> 6)] : "=") +
            (i + 2 < bytes.length ? BASE64_ALPHABET[c & 63] : "=");
        parts.push(chunk);
    }
    return parts.join("");
}

function base64ToBytes(base64) {
    const clean = String(base64).replace(/\s+/g, "");
    const padding = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
    const length = Math.floor((clean.length * 3) / 4) - padding;
    const bytes = new Uint8Array(length);
    let index = 0;
    for (let i = 0; i < clean.length; i += 4) {
        const a = BASE64_LOOKUP[clean[i]] || 0;
        const b = BASE64_LOOKUP[clean[i + 1]] || 0;
        const c = BASE64_LOOKUP[clean[i + 2]] || 0;
        const d = BASE64_LOOKUP[clean[i + 3]] || 0;
        const value = (a << 18) | (b << 12) | (c << 6) | d;
        if (index < length) bytes[index++] = (value >> 16) & 255;
        if (index < length) bytes[index++] = (value >> 8) & 255;
        if (index < length) bytes[index++] = value & 255;
    }
    return bytes;
}

function splitDataUrl(image) {
    const text = String(image || "");
    const match = /^data:([^;,]+)?(;base64)?,([\s\S]*)$/.exec(text);
    if (!match) return { mimeType: "image/png", base64: text };
    return { mimeType: match[1] || "image/png", base64: match[3] };
}

// ---------------------------------------------------------------------------
// 临时文件
// ---------------------------------------------------------------------------

async function writeTemporaryPng(image, prefix) {
    const { base64 } = splitDataUrl(image);
    const bytes = base64ToBytes(base64);
    const folder = await fs.getTemporaryFolder();
    const file = await folder.createFile(`${prefix}-${Date.now()}.png`, { overwrite: true });
    await file.write(bytes.buffer, { format: formats.binary });
    return file;
}

async function readFileBase64(file) {
    const buffer = await file.read({ format: formats.binary });
    return bytesToBase64(new Uint8Array(buffer));
}

// ---------------------------------------------------------------------------
// PS 操作（全部包在 executeAsModal 里）
// ---------------------------------------------------------------------------

function findDocument(name) {
    if (!name) return app.activeDocument;
    const docs = app.documents;
    for (let i = 0; i < docs.length; i += 1) {
        if (docs[i].name === name) return docs[i];
    }
    throw new Error(`文档不存在：${name}`);
}

/** 把图片贴成当前文档的新图层（智能对象），只新增，不改动既有图层。 */
async function placeImageAsLayer(image, documentName, layerName) {
    const target = documentName ? findDocument(documentName) : app.activeDocument;
    const file = await writeTemporaryPng(image, "ps-node-push");
    const token = fs.createSessionToken(file);

    await core.executeAsModal(
        async () => {
            if (target && target.name !== (app.activeDocument && app.activeDocument.name)) {
                await action.batchPlay([{ _obj: "select", _target: [{ _ref: "document", _name: target.name }] }], {});
            }
            await action.batchPlay([{ _obj: "placeEvent", null: { _path: token, _kind: "local" }, _options: { dialogOptions: "dontDisplay" } }], {});
            const doc = app.activeDocument;
            const placed = doc && doc.activeLayers && doc.activeLayers.length ? doc.activeLayers[0] : null;
            if (layerName && placed) placed.name = layerName;
        },
        { commandName: "PS 节点：贴入图片" },
    );

    const doc = app.activeDocument;
    const layer = doc.layers && doc.layers.length ? doc.layers[0].name : layerName || "";
    return { doc: doc.name, layer, width: doc.width, height: doc.height };
}

/** 以图片新建文档（push 的 newDoc 模式）。 */
async function openImageAsNewDocument(image) {
    const file = await writeTemporaryPng(image, "ps-node-new");
    const token = fs.createSessionToken(file);
    await core.executeAsModal(
        async () => {
            await action.batchPlay([{ _obj: "open", null: { _path: token, _kind: "local" }, _options: { dialogOptions: "dontDisplay" } }], {});
        },
        { commandName: "PS 节点：新建文档" },
    );
    const doc = app.activeDocument;
    return { doc: doc.name, width: doc.width, height: doc.height };
}

/** 导出整幅拼合图：副本上 flatten/缩放，不弄脏用户文档。 */
async function exportMergedImage(payload) {
    const source = findDocument(payload && payload.doc);
    const maxEdge = Number(payload && payload.maxEdge) > 0 ? Number(payload.maxEdge) : 0;
    const folder = await fs.getTemporaryFolder();
    const file = await folder.createFile(`ps-node-pull-${Date.now()}.png`, { overwrite: true });
    let exportedWidth = source.width;
    let exportedHeight = source.height;

    await core.executeAsModal(
        async () => {
            const copy = await source.duplicate();
            try {
                // PNG 只支持 8 位 RGB/灰度，先规整再导出
                if (copy.mode !== constants.DocumentMode.RGB) {
                    try {
                        await copy.changeMode(constants.ChangeMode.RGB);
                    } catch (error) {
                        log(`转 RGB 失败（继续尝试导出）：${messageOf(error)}`);
                    }
                }
                try {
                    copy.bitsPerChannel = constants.BitsPerChannelType.EIGHT;
                } catch (error) {
                    log(`转 8 位失败（继续尝试导出）：${messageOf(error)}`);
                }
                await copy.flatten();
                if (maxEdge > 0) {
                    const longest = Math.max(copy.width, copy.height);
                    if (longest > maxEdge) {
                        const scale = maxEdge / longest;
                        await copy.resizeImage(Math.max(1, Math.round(copy.width * scale)), Math.max(1, Math.round(copy.height * scale)));
                    }
                }
                exportedWidth = copy.width;
                exportedHeight = copy.height;
                await copy.saveAs.png(file, { compression: 6 }, true);
            } finally {
                copy.closeWithoutSaving();
            }
        },
        { commandName: "PS 节点：导出画面" },
    );

    return {
        image: "data:image/png;base64," + (await readFileBase64(file)),
        doc: source.name,
        width: exportedWidth,
        height: exportedHeight,
    };
}

// ---------------------------------------------------------------------------
// 中继客户端
// ---------------------------------------------------------------------------

function readStorage() {
    try {
        return JSON.parse(window.localStorage.getItem(RELAY_STORAGE_KEY) || "{}");
    } catch (error) {
        return {};
    }
}

function writeStorage(value) {
    try {
        window.localStorage.setItem(RELAY_STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
        // UXP 版本不支持 localStorage 时就只在本次会话里生效
    }
}

function loadRelay() {
    const saved = readStorage();
    if (saved.url) relay.url = String(saved.url).replace(/\/+$/, "");
    if (saved.token) relay.token = String(saved.token);
    const urlInput = el("url");
    const tokenInput = el("token");
    if (urlInput) urlInput.value = relay.url;
    if (tokenInput) tokenInput.value = relay.token;
}

function saveRelay() {
    const urlInput = el("url");
    const tokenInput = el("token");
    if (urlInput) relay.url = String(urlInput.value).trim().replace(/\/+$/, "") || relay.url;
    if (tokenInput) relay.token = String(tokenInput.value).trim();
    writeStorage({ url: relay.url, token: relay.token });
}

async function request(path, init) {
    const options = init || {};
    const headers = Object.assign({ "content-type": "application/json", "x-relay-token": relay.token }, options.headers || {});
    return fetch(`${relay.url}${path}`, Object.assign({ cache: "no-store" }, options, { headers }));
}

async function connect() {
    saveRelay();
    try {
        const response = await request("/api/health");
        if (!response.ok) throw new Error(`中继返回 ${response.status}`);
        const data = await response.json();
        const psConnected = Boolean(data.photoshop && data.photoshop.connected);
        setStatus(true, psConnected ? "已连接 · 中继在线" : "已连接 · 等 PS 通道");
        log(`连接成功：${relay.url}`);
        console.log("[ps-node] connected: " + relay.url);
        void startPolling();
    } catch (error) {
        setStatus(false, "连接失败");
        log(`连接失败：${messageOf(error)}`);
        console.log("[ps-node] connect failed: " + messageOf(error));
        // 中继可能比 PS 晚启动，失败时自动重试
        setTimeout(() => {
            if (!polling) void connect();
        }, 3000);
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startPolling() {
    if (polling) return;
    polling = true;
    log("开始等待画布命令…");
    while (polling) {
        try {
            const response = await request(`/api/next?timeout=${POLL_TIMEOUT_MS}`);
            if (response.status === 204) continue;
            if (!response.ok) throw new Error(`中继返回 ${response.status}`);
            const job = await response.json();
            log(`收到命令：${job.command}`);
            const result = await handle(job.command, job.payload);
            await request("/api/result", { method: "POST", body: JSON.stringify(Object.assign({ id: job.id }, result)) });
            if (result.ok === false) log(`命令失败：${result.error}`);
        } catch (error) {
            setStatus(false, "已断开");
            log(`长轮询中断：${messageOf(error)}`);
            await sleep(2000);
        }
    }
}

async function handle(command, payload) {
    try {
        if (command === "ping") return { ok: true, data: { pong: true } };
        if (command === "docs") {
            const docs = app.documents.map((doc) => ({
                name: doc.name,
                width: doc.width,
                height: doc.height,
                layers: doc.layers ? doc.layers.map((layer) => layer.name) : [],
            }));
            return { ok: true, data: { docs } };
        }
        if (command === "push") {
            const image = payload && payload.image;
            if (!image) return { ok: false, error: "缺少图片数据" };
            if (payload.mode === "newDoc") return { ok: true, data: await openImageAsNewDocument(image) };
            if (!app.documents.length) return { ok: false, error: "PS 里没有打开的文档" };
            return { ok: true, data: await placeImageAsLayer(image, payload.doc, payload.layerName) };
        }
        if (command === "pull") {
            return { ok: true, data: await exportMergedImage(payload || {}) };
        }
        return { ok: false, error: `未知命令：${command}` };
    } catch (error) {
        return { ok: false, error: messageOf(error) };
    }
}

async function showDocs() {
    const result = await handle("docs", {});
    if (result.ok) {
        const names = result.data.docs.map((doc) => doc.name).join("、");
        log(`文档：${names || "没有打开的文档"}`);
    } else {
        log(`读取失败：${result.error}`);
    }
}

// ---------------------------------------------------------------------------
// 面板
// ---------------------------------------------------------------------------

entrypoints.setup({
    panels: {
        psNodePanel: {
            show() {
                loadRelay();
            },
        },
    },
});

function boot() {
    loadRelay();
    setStatus(false, "未连接");
    const connectButton = el("connect");
    if (connectButton) connectButton.addEventListener("click", () => void connect());
    const docsButton = el("docs");
    if (docsButton) docsButton.addEventListener("click", () => void showDocs());
    // 中继允许「无 Origin」的本机客户端免 token 连接（PS 侧就是这种），所以启动即自动连。
    setTimeout(() => {
        if (!polling) void connect();
    }, 300);
}

// 面板 HTML 可能已经解析完（UXP 里 DOMContentLoaded 不一定还能等到），两种时机都兜住。
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
} else {
    boot();
}
