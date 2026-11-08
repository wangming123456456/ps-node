// PS 侧：面板 + 中继客户端（HTTP 长轮询，零依赖）+ PS 操作实现。
// 协议见仓库根 docs/decisions.md。
//
// 实现依据（Adobe 官方 UXP Photoshop 文档）：
//   - Document.duplicate / flatten / resizeImage / saveAs.png / closeWithoutSaving
//   - batchPlay placeEvent / open，用 fs.createSessionToken 传本地文件
// 注意：本文件还没在真机（UXP Developer Tool）里跑过，见 README「待验证」。

const { entrypoints, storage } = require("uxp");
const { app, core, action, constants, imaging } = require("photoshop");

const fs = storage.localFileSystem;
const formats = storage.formats;

console.log("[ps-node] main.js loaded");

const RELAY_STORAGE_KEY = "ps-node:relay";
const SETTINGS_STORAGE_KEY = "ps-node:settings";
const MODELS_STORAGE_KEY = "ps-node:models";
const LOG_STORAGE_KEY = "ps-node:log";
const POLL_TIMEOUT_MS = 25000;

const relay = { url: "http://localhost:23310", token: "" };
let polling = false;
let relayConnected = false;

const DEFAULT_SETTINGS = { model: "", reference: true, autoApply: false, previewSize: 512, autoRefresh: true };
let uxSettings = Object.assign({}, DEFAULT_SETTINGS);
let pendingAutoApply = false;

function readJsonStorage(key, fallback) {
    try {
        return JSON.parse(window.localStorage.getItem(key) || "null") || fallback;
    } catch (error) {
        return fallback;
    }
}

function writeJsonStorage(key, value) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        // UXP 版本不支持 localStorage 时就只在本次会话里生效
    }
}

function loadUxSettings() {
    uxSettings = Object.assign({}, DEFAULT_SETTINGS, readJsonStorage(SETTINGS_STORAGE_KEY, {}));
    return uxSettings;
}

function saveUxSettings(patch) {
    uxSettings = Object.assign({}, uxSettings, patch);
    writeJsonStorage(SETTINGS_STORAGE_KEY, uxSettings);
    return uxSettings;
}

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
    const time = new Date().toLocaleTimeString("zh-CN");
    const entry = `${time}  ${line}`;
    const node = el("log");
    if (node) node.textContent = `${entry}\n` + node.textContent;
    appendLogStorage(entry);
    if (/失败|中断|错误|不存在|选区/.test(line)) {
        const section = el("log-section");
        const body = el("log-body");
        if (section) section.classList.add("open");
        if (body) body.hidden = false;
    }
}

/** 日志同时存一份到 localStorage，设置面板里能看历史（两个面板是不同 JS 上下文）。 */
function appendLogStorage(entry) {
    const lines = readJsonStorage(LOG_STORAGE_KEY, []);
    lines.unshift(entry);
    writeJsonStorage(LOG_STORAGE_KEY, lines.slice(0, 200));
}

function setStatus(kind, label) {
    relayConnected = kind === "ok";
    const dot = el("dot");
    const status = el("status");
    if (dot) dot.className = kind === "ok" ? "dot ok" : kind === "error" ? "dot error" : "dot";
    if (status) status.textContent = label;
    const stateNode = el("doc-state");
    if (stateNode) stateNode.textContent = relayConnected ? "中继已连接" : "中继未连接";
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
    const { mimeType, base64 } = splitDataUrl(image);
    const bytes = base64ToBytes(base64);
    const extension = /jpe?g/i.test(mimeType) ? "jpg" : "png";
    const folder = await fs.getTemporaryFolder();
    const file = await folder.createFile(`${prefix}-${Date.now()}.${extension}`, { overwrite: true });
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

/**
 * 导出整幅拼合图。优先用 Imaging API 直接取像素，不复制文档——
 * 以前「复制文档→导出→关闭」会让 PS 的文档窗口闪一下。
 */
async function exportMergedImage(payload) {
    const source = findDocument(payload && payload.doc);
    const maxEdge = Number(payload && payload.maxEdge) > 0 ? Number(payload.maxEdge) : 0;
    const width = source.width;
    const height = source.height;
    const longest = Math.max(width, height);
    const targetSize =
        maxEdge > 0 && longest > maxEdge
            ? { width: Math.max(1, Math.round((width * maxEdge) / longest)), height: Math.max(1, Math.round((height * maxEdge) / longest)) }
            : undefined;
    try {
        // Imaging API 必须在 executeAsModal 作用域内调用（否则会报 modal scope 错误并回退到复制文档）
        const encoded = await core.executeAsModal(
            async () => {
                const result = await imaging.getPixels({
                    documentID: source.id,
                    sourceBounds: { left: 0, top: 0, right: width, bottom: height },
                    applyAlpha: true,
                    componentSize: 8,
                    ...(targetSize ? { targetSize } : {}),
                });
                try {
                    const base64 = await imaging.encodeImageData({ imageData: result.imageData, base64: true });
                    console.log("[ps-node] export imaging: ok " + result.imageData.width + "x" + result.imageData.height);
                    return { base64, width: result.imageData.width, height: result.imageData.height };
                } finally {
                    if (result.imageData && typeof result.imageData.dispose === "function") result.imageData.dispose();
                }
            },
            { commandName: "PS 节点：读取画面" },
        );
        return {
            image: "data:image/jpeg;base64," + encoded.base64,
            doc: source.name,
            width: encoded.width,
            height: encoded.height,
        };
    } catch (error) {
        console.log("[ps-node] export imaging failed: " + messageOf(error));
        log(`Imaging 导出失败，回退副本导出：${messageOf(error)}`);
        return exportMergedViaDuplicate(source, maxEdge);
    }
}

/** 兼容回退：副本导出（老实现，会让文档窗口闪一下）。 */
async function exportMergedViaDuplicate(source, maxEdge) {
    console.log("[ps-node] export duplicate: start");
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

/** 读当前选区边界；没有选区或选区太小返回 null。 */
function readSelectionBounds(logMiss = false) {
    try {
        const doc = app.activeDocument;
        if (!doc) {
            if (logMiss) log("读选区：没有活动文档");
            return null;
        }
        const selection = doc.selection;
        if (!selection) {
            if (logMiss) log("读选区：DOM selection 不可用");
            return null;
        }
        const bounds = selection.bounds;
        if (!bounds) {
            if (logMiss) log("读选区：DOM bounds 为空（当前无选区）");
            return null;
        }
        const left = Math.round(bounds.left);
        const top = Math.round(bounds.top);
        const right = Math.round(bounds.right);
        const bottom = Math.round(bounds.bottom);
        if (right - left < 2 || bottom - top < 2) return null;
        return { left, top, right, bottom };
    } catch (error) {
        if (logMiss) log(`读选区异常：${messageOf(error)}`);
        return null;
    }
}

function unitValue(value) {
    if (value && typeof value === "object" && typeof value._value === "number") return value._value;
    return Number(value);
}

/** DOM 读不到时用 batchPlay 兜底（PS 25.0 上实测 DOM 的 selection.bounds 不一定可用）。 */
async function resolveSelectionBounds() {
    const domBounds = readSelectionBounds(true);
    if (domBounds) return domBounds;
    try {
        const result = await action.batchPlay(
            [{ _obj: "get", _target: [{ _property: "selection" }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" }] }],
            { synchronousExecution: false },
        );
        const selection = result && result[0] ? result[0].selection : null;
        if (!selection) {
            log(`读选区 batchPlay 返回空：${JSON.stringify(result).slice(0, 160)}`);
            return null;
        }
        const left = Math.round(unitValue(selection.left));
        const top = Math.round(unitValue(selection.top));
        const right = Math.round(unitValue(selection.right));
        const bottom = Math.round(unitValue(selection.bottom));
        if (![left, top, right, bottom].every((value) => Number.isFinite(value))) return null;
        if (right - left < 2 || bottom - top < 2) return null;
        return { left, top, right, bottom };
    } catch (error) {
        log(`读选区失败：${messageOf(error)}`);
        return null;
    }
}

/** 导出选区范围的参考图（Imaging 直接取区域像素，不复制文档）。 */
async function exportSelectionReference(bounds) {
    const source = app.activeDocument;
    const left = Math.max(0, Math.round(bounds.left));
    const top = Math.max(0, Math.round(bounds.top));
    const right = Math.min(source.width, Math.round(bounds.right));
    const bottom = Math.min(source.height, Math.round(bounds.bottom));
    if (right - left < 2 || bottom - top < 2) throw new Error("选区超出画布范围");
    try {
        const encoded = await core.executeAsModal(
            async () => {
                const result = await imaging.getPixels({
                    documentID: source.id,
                    sourceBounds: { left, top, right, bottom },
                    applyAlpha: true,
                    componentSize: 8,
                });
                try {
                    const base64 = await imaging.encodeImageData({ imageData: result.imageData, base64: true });
                    return { base64 };
                } finally {
                    if (result.imageData && typeof result.imageData.dispose === "function") result.imageData.dispose();
                }
            },
            { commandName: "PS 节点：读取选区" },
        );
        return { image: "data:image/jpeg;base64," + encoded.base64, width: right - left, height: bottom - top };
    } catch (error) {
        log(`选区 Imaging 导出失败，回退副本：${messageOf(error)}`);
        return exportSelectionViaDuplicate(bounds);
    }
}

/** 兼容回退：副本裁切导出（老实现，会让文档窗口闪一下）。 */
async function exportSelectionViaDuplicate(bounds) {
    const source = app.activeDocument;
    const folder = await fs.getTemporaryFolder();
    const file = await folder.createFile(`ps-node-selection-${Date.now()}.png`, { overwrite: true });
    await core.executeAsModal(
        async () => {
            const copy = await source.duplicate();
            try {
                if (copy.mode !== constants.DocumentMode.RGB) {
                    try {
                        await copy.changeMode(constants.ChangeMode.RGB);
                    } catch (error) {
                        log(`转 RGB 失败（继续）：${messageOf(error)}`);
                    }
                }
                try {
                    copy.bitsPerChannel = constants.BitsPerChannelType.EIGHT;
                } catch (error) {
                    log(`转 8 位失败（继续）：${messageOf(error)}`);
                }
                await copy.flatten();
                await copy.crop({ top: bounds.top, left: bounds.left, bottom: bounds.bottom, right: bounds.right });
                await copy.saveAs.png(file, { compression: 6 }, true);
            } finally {
                copy.closeWithoutSaving();
            }
        },
        { commandName: "PS 节点：导出选区参考" },
    );
    return {
        image: "data:image/png;base64," + (await readFileBase64(file)),
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
    };
}

/** 把生成图缩放/位移到选区框内，贴成新图层。 */
async function placeImageInSelection(image, bounds, layerName) {
    const file = await writeTemporaryPng(image, "ps-node-selection-result");
    const token = fs.createSessionToken(file);
    await core.executeAsModal(
        async () => {
            await action.batchPlay([{ _obj: "placeEvent", null: { _path: token, _kind: "local" }, _options: { dialogOptions: "dontDisplay" } }], {});
            const doc = app.activeDocument;
            const layer = doc && doc.activeLayers && doc.activeLayers.length ? doc.activeLayers[0] : null;
            if (!layer) throw new Error("放置图层失败");
            if (layerName) layer.name = layerName;
            const current = layer.bounds;
            const currentWidth = Math.max(1, current.right - current.left);
            const currentHeight = Math.max(1, current.bottom - current.top);
            const targetWidth = Math.max(1, bounds.right - bounds.left);
            const targetHeight = Math.max(1, bounds.bottom - bounds.top);
            await layer.scale((targetWidth / currentWidth) * 100, (targetHeight / currentHeight) * 100, constants.AnchorPosition.TOPLEFT);
            const scaled = layer.bounds;
            await layer.translate(bounds.left - scaled.left, bounds.top - scaled.top);
        },
        { commandName: "PS 节点：贴回选区" },
    );
    const doc = app.activeDocument;
    return {
        doc: doc.name,
        layer: layerName,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
    };
}

// ---------------------------------------------------------------------------
// 中继客户端
// ---------------------------------------------------------------------------

function loadRelay() {
    const saved = readJsonStorage(RELAY_STORAGE_KEY, {});
    if (saved.url) relay.url = String(saved.url).replace(/\/+$/, "");
    if (saved.token) relay.token = String(saved.token);
}

/** 设置面板里改完地址后调用；主面板没有这些输入框时保持原值。 */
function saveRelayInputs() {
    const urlInput = el("setting-url");
    const tokenInput = el("setting-token");
    if (urlInput) relay.url = String(urlInput.value).trim().replace(/\/+$/, "") || relay.url;
    if (tokenInput) relay.token = String(tokenInput.value).trim();
    writeJsonStorage(RELAY_STORAGE_KEY, { url: relay.url, token: relay.token });
}

async function request(path, init) {
    const options = init || {};
    const headers = Object.assign({ "content-type": "application/json", "x-relay-token": relay.token }, options.headers || {});
    return fetch(`${relay.url}${path}`, Object.assign({ cache: "no-store" }, options, { headers }));
}

async function connect() {
    saveRelayInputs();
    try {
        const response = await request("/api/health");
        if (!response.ok) throw new Error(`中继返回 ${response.status}`);
        const data = await response.json();
        const psConnected = Boolean(data.photoshop && data.photoshop.connected);
        setStatus("ok", psConnected ? "已连接 · 中继在线" : "已连接");
        log(`连接成功：${relay.url}`);
        console.log("[ps-node] connected: " + relay.url);
        refreshDocumentInfo();
        void refreshModels();
        void refreshShot();
        void startPolling();
    } catch (error) {
        setStatus("error", "连接失败");
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

/** PS 操作超过 110s 强制返回错误，避免单条命令把轮询循环卡死。 */
function withTimeout(promise, ms, message) {
    let timer;
    const timeout = new Promise((resolve, reject) => {
        timer = setTimeout(() => reject(new Error(message)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function startPolling() {
    if (polling) return;
    polling = true;
    log("开始等待画布命令…");
    while (polling) {
        try {
            const response = await request(`/api/next?timeout=${POLL_TIMEOUT_MS}`);
            if (!relayConnected) setStatus("ok", "已连接");
            if (response.status === 204) continue;
            if (!response.ok) throw new Error(`中继返回 ${response.status}`);
            const job = await response.json();
            log(`收到命令：${job.command}`);
            const result = await withTimeout(handle(job.command, job.payload), 110000, "PS 操作超时（110s）");
            await request("/api/result", { method: "POST", body: JSON.stringify(Object.assign({ id: job.id }, result)) });
            if (result.ok === false) log(`命令失败：${result.error}`);
            refreshDocumentInfo();
        } catch (error) {
            setStatus("error", "已断开");
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
        if (command === "selection") {
            const bounds = await resolveSelectionBounds();
            return { ok: true, data: { bounds, doc: currentDocName() } };
        }
        if (command === "push") {
            const image = payload && payload.image;
            if (!image) return { ok: false, error: "缺少图片数据" };
            if (payload.mode === "newDoc") return { ok: true, data: await openImageAsNewDocument(image) };
            if (!app.documents.length) return { ok: false, error: "PS 里没有打开的文档" };
            // 从画布取回选区后，推送默认贴回原来的选区位置
            if (payload.selection && payload.selection.left !== undefined) {
                return { ok: true, data: await placeImageInSelection(image, payload.selection, payload.layerName) };
            }
            return { ok: true, data: await placeImageAsLayer(image, payload.doc, payload.layerName) };
        }
        if (command === "pull") {
            // 有选区时只取选区内容，没有选区才取整幅拼合图
            const bounds = await resolveSelectionBounds();
            if (bounds) {
                const cropped = await exportSelectionReference(bounds);
                return {
                    ok: true,
                    data: {
                        image: cropped.image,
                        doc: currentDocName(),
                        width: cropped.width,
                        height: cropped.height,
                        selection: bounds,
                    },
                };
            }
            return { ok: true, data: await exportMergedImage(payload || {}) };
        }
        return { ok: false, error: `未知命令：${command}` };
    } catch (error) {
        return { ok: false, error: messageOf(error) };
    }
}

/** 直接在 PS 里读当前文档信息，不占用中继命令通道。 */
function refreshDocumentInfo() {
    const nameNode = el("doc-name");
    const metaNode = el("doc-meta");
    const stateNode = el("doc-state");
    let name = "没有打开的文档";
    let meta = "";
    try {
        const doc = app.activeDocument;
        name = doc.name;
        const layerCount = doc.layers ? doc.layers.length : 0;
        const selection = readSelectionBounds();
        meta = `${doc.width}×${doc.height} · ${layerCount} 个图层` + (selection ? ` · 选区 ${selection.right - selection.left}×${selection.bottom - selection.top}` : "");
        const signature = `${name}|${layerCount}`;
        if (signature !== lastDocSignature) {
            lastDocSignature = signature;
            if (uxSettings.autoRefresh) void refreshShot();
        }
    } catch (error) {
        // 没有打开的文档
    }
    if (nameNode) nameNode.textContent = name;
    if (metaNode) metaNode.textContent = meta;
    if (stateNode) stateNode.textContent = relayConnected ? "中继已连接" : "中继未连接";
}

// ---------------------------------------------------------------------------
// 画面预览 / 与画布同步
// ---------------------------------------------------------------------------

let shotBusy = false;
let lastDocSignature = "";

/** 重新渲染当前文档缩略图（小尺寸导出，不影响原文档）。 */
async function refreshShot() {
    const image = el("shot-image");
    const empty = el("preview-empty");
    if (!image || !empty) return;
    try {
        const doc = app.activeDocument;
        if (!doc) {
            image.hidden = true;
            empty.hidden = false;
            empty.textContent = "没有打开的文档";
            return;
        }
        const shot = await exportMergedImage({ maxEdge: uxSettings.previewSize || 512 });
        image.src = shot.image;
        image.hidden = false;
        empty.hidden = true;
    } catch (error) {
        image.hidden = true;
        empty.hidden = false;
        empty.textContent = `预览失败：${messageOf(error)}`;
    }
}

// 画布同步入口统一放到画布侧（PS 节点推送/取回、图片节点右键），PS 面板不再提供这两个按钮。

// ---------------------------------------------------------------------------
// 生成（请求画布宿主 AI 执行）
// ---------------------------------------------------------------------------

let lastRender = null;
let lastRenderSelection = null;
let modelsLoaded = false;
let genBusy = false;

function currentDocName() {
    try {
        return app.activeDocument ? app.activeDocument.name : "";
    } catch (error) {
        return "";
    }
}

function setGenState(text, isError) {
    const node = el("gen-state");
    if (!node) return;
    node.textContent = text;
    node.className = isError ? "muted gen__state error" : "muted gen__state";
}

function setGenBusy(busy) {
    genBusy = busy;
    const renderButton = el("render");
    if (renderButton) renderButton.disabled = busy;
    const genApplyButton = el("gen-apply");
    if (genApplyButton) genApplyButton.disabled = busy || !lastRender;
}

/** 向画布发一条请求并等结果（generate / models）。 */
async function requestCanvas(command, payload, timeoutMs) {
    const submitted = await request("/api/ps/request", { method: "POST", body: JSON.stringify({ command, payload }) });
    if (!submitted.ok) throw new Error(`中继返回 ${submitted.status}`);
    const submittedBody = await submitted.json();
    const id = submittedBody.id;
    const deadline = Date.now() + (timeoutMs || 900000);
    while (Date.now() < deadline) {
        const polled = await request(`/api/ps/result?id=${encodeURIComponent(id)}&timeout=${POLL_TIMEOUT_MS}`);
        if (polled.status === 204) continue;
        if (!polled.ok) throw new Error(`中继返回 ${polled.status}`);
        const result = await polled.json();
        if (!result.ok) throw new Error(result.error || "画布返回失败");
        return result.data;
    }
    throw new Error("等待画布响应超时");
}

async function refreshModels() {
    const select = el("model-select");
    if (!select) return;
    try {
        const data = await requestCanvas("models", {}, 10000);
        const models = data && Array.isArray(data.models) ? data.models : [];
        const current = select.value;
        select.innerHTML = "";
        const fallback = document.createElement("option");
        fallback.value = "";
        fallback.textContent = models.length ? "默认模型" : "画布未配置模型";
        select.appendChild(fallback);
        models.forEach((model) => {
            const option = document.createElement("option");
            option.value = model.value;
            option.textContent = model.label || model.value;
            select.appendChild(option);
        });
        if (current && models.some((model) => model.value === current)) select.value = current;
        const preferred = uxSettings.model;
        if (preferred && models.some((model) => model.value === preferred)) select.value = preferred;
        writeJsonStorage(MODELS_STORAGE_KEY, models);
        modelsLoaded = models.length > 0;
        setGenState(models.length ? "就绪" : "画布未配置模型", models.length === 0);
    } catch (error) {
        modelsLoaded = false;
        setGenState(`模型列表获取失败：${messageOf(error)}`, true);
    }
}

async function renderImage() {
    const promptNode = el("prompt");
    const prompt = promptNode ? String(promptNode.value || "").trim() : "";
    if (!prompt) {
        setGenState("先填提示词", true);
        return;
    }
    if (genBusy) return;
    setGenBusy(true);
    setGenState("渲染中…");
    log("开始渲染…");
    try {
        const selectionBounds = await resolveSelectionBounds();
        let reference;
        if (selectionBounds) {
            try {
                const prepared = await exportSelectionReference(selectionBounds);
                reference = prepared.image;
                setGenState(`已截取选区 ${prepared.width}×${prepared.height}，生成中…`);
                log(`已截取选区 ${prepared.width}×${prepared.height}`);
            } catch (error) {
                log(`选区参考图失败，改用整图：${messageOf(error)}`);
            }
        }
        if (!reference) {
            const refToggle = el("ref-toggle");
            if (refToggle && refToggle.checked) {
                try {
                    const pulled = await exportMergedImage({ maxEdge: 1024 });
                    reference = pulled.image;
                } catch (error) {
                    log(`参考图获取失败，改纯文生图：${messageOf(error)}`);
                }
            }
        }
        const modelNode = el("model-select");
        const data = await requestCanvas("generate", {
            prompt,
            model: modelNode ? String(modelNode.value || "") : "",
            reference,
            doc: currentDocName(),
            selection: selectionBounds || undefined,
        });
        if (!data || !data.image) throw new Error("画布没有返回图片");
        lastRender = data.image;
        lastRenderSelection = selectionBounds;
        const genApply = el("gen-apply");
        if (genApply) genApply.textContent = selectionBounds ? "贴回选区" : "添加到图层";
        const overlay = el("result-overlay");
        if (overlay) overlay.hidden = false;
        const preview = el("preview");
        if (preview) {
            preview.src = lastRender;
            preview.hidden = false;
        }
        setGenState(selectionBounds ? "渲染完成（选区）" : "渲染完成");
        log(selectionBounds ? "渲染完成，可贴回选区" : "渲染完成");
        if (uxSettings.autoApply) pendingAutoApply = true;
    } catch (error) {
        setGenState(messageOf(error), true);
        log(`渲染失败：${messageOf(error)}`);
    } finally {
        setGenBusy(false);
        if (pendingAutoApply) {
            pendingAutoApply = false;
            void applyRender();
        }
    }
}

async function applyRender() {
    if (!lastRender || genBusy) return;
    setGenBusy(true);
    setGenState("正在添加到图层…");
    try {
        const time = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
        if (lastRenderSelection) {
            const data = await placeImageInSelection(lastRender, lastRenderSelection, `AI 选区 ${time}`);
            setGenState(`已贴回选区：${data.layer}`);
            log(`已贴回选区：${data.layer}`);
        } else {
            const data = await placeImageAsLayer(lastRender, currentDocName(), `AI 生成 ${time}`);
            setGenState(`已添加到图层：${data.layer}`);
            log(`已添加到图层：${data.layer}`);
        }
        refreshDocumentInfo();
        const preview = el("preview");
        if (preview) preview.hidden = true;
        const overlay = el("result-overlay");
        if (overlay) overlay.hidden = true;
        void refreshShot();
    } catch (error) {
        setGenState(messageOf(error), true);
        log(`添加到图层失败：${messageOf(error)}`);
    } finally {
        setGenBusy(false);
    }
}

// ---------------------------------------------------------------------------
// 面板
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 面板（主面板 / 设置面板，两个独立窗口）
// ---------------------------------------------------------------------------

const bootedViews = { main: false, settings: false };

function showView(name) {
    const mainView = el("view-main");
    const settingsView = el("view-settings");
    if (mainView) mainView.hidden = name !== "main";
    if (settingsView) settingsView.hidden = name !== "settings";
}

entrypoints.setup({
    panels: {
        psNodePanel: {
            show() {
                bootPanel("main");
            },
        },
        psSettingsPanel: {
            show() {
                bootPanel("settings");
            },
        },
    },
});

function bootPanel(name) {
    if (bootedViews[name]) {
        loadUxSettings();
        showView(name);
        return;
    }
    bootedViews[name] = true;
    showView(name);
    loadUxSettings();
    loadRelay();
    if (name === "main") bootMain();
    else bootSettings();
}

function bootMain() {
    setStatus("idle", "未连接");
    refreshDocumentInfo();
    const refToggle = el("ref-toggle");
    if (refToggle) refToggle.checked = Boolean(uxSettings.reference);
    const connectButton = el("connect");
    if (connectButton) connectButton.addEventListener("click", () => void connect());
    const refreshButton = el("refresh");
    if (refreshButton)
        refreshButton.addEventListener("click", () => {
            refreshDocumentInfo();
            void refreshShot();
        });
    const renderButton = el("render");
    if (renderButton) renderButton.addEventListener("click", () => void renderImage());
    const genApplyButton = el("gen-apply");
    if (genApplyButton) genApplyButton.addEventListener("click", () => void applyRender());
    const resultClose = el("result-close");
    if (resultClose)
        resultClose.addEventListener("click", () => {
            const preview = el("preview");
            if (preview) preview.hidden = true;
            const overlay = el("result-overlay");
            if (overlay) overlay.hidden = true;
            void refreshShot();
        });
    const shotRefresh = el("shot-refresh");
    if (shotRefresh) shotRefresh.addEventListener("click", () => void refreshShot());
    // 文档信息随 PS 操作变化；顺带重读设置，让设置面板的修改生效。
    window.setInterval(() => {
        loadUxSettings();
        refreshDocumentInfo();
    }, 3000);
    // 中继允许「无 Origin」的本机客户端免 token 连接（PS 侧就是这种），所以启动即自动连。
    setTimeout(() => {
        if (!polling) void connect();
    }, 300);
}

async function checkRelayHealth() {
    const dot = el("settings-dot");
    const status = el("settings-status");
    if (dot) dot.className = "dot";
    if (status) status.textContent = "检查中…";
    try {
        const response = await request("/api/health");
        if (!response.ok) throw new Error(`中继返回 ${response.status}`);
        const data = await response.json();
        const psConnected = Boolean(data.photoshop && data.photoshop.connected);
        if (dot) dot.className = "dot ok";
        if (status) status.textContent = psConnected ? "已连接" : "中继在线，PS 未连接";
        return true;
    } catch (error) {
        if (dot) dot.className = "dot error";
        if (status) status.textContent = `未连接：${messageOf(error)}`;
        return false;
    }
}

function bootSettings() {
    const urlInput = el("setting-url");
    const tokenInput = el("setting-token");
    if (urlInput) urlInput.value = relay.url;
    if (tokenInput) tokenInput.value = relay.token;

    const modelSelect = el("setting-model");
    if (modelSelect) {
        const models = readJsonStorage(MODELS_STORAGE_KEY, []);
        const fallback = document.createElement("option");
        fallback.value = "";
        fallback.textContent = "默认模型";
        modelSelect.innerHTML = "";
        modelSelect.appendChild(fallback);
        models.forEach((model) => {
            const option = document.createElement("option");
            option.value = model.value;
            option.textContent = model.label || model.value;
            modelSelect.appendChild(option);
        });
        modelSelect.value = uxSettings.model || "";
        modelSelect.addEventListener("change", () => saveUxSettings({ model: modelSelect.value }));
    }

    const refToggle = el("setting-ref");
    if (refToggle) {
        refToggle.checked = Boolean(uxSettings.reference);
        refToggle.addEventListener("change", () => saveUxSettings({ reference: refToggle.checked }));
    }
    const autoApply = el("setting-auto-apply");
    if (autoApply) {
        autoApply.checked = Boolean(uxSettings.autoApply);
        autoApply.addEventListener("change", () => saveUxSettings({ autoApply: autoApply.checked }));
    }
    const autoRefresh = el("setting-auto-refresh");
    if (autoRefresh) {
        autoRefresh.checked = Boolean(uxSettings.autoRefresh);
        autoRefresh.addEventListener("change", () => saveUxSettings({ autoRefresh: autoRefresh.checked }));
    }

    const sizeGroup = el("setting-preview-size");
    if (sizeGroup) {
        const buttons = Array.from(sizeGroup.querySelectorAll("button"));
        const applySize = (value) => {
            buttons.forEach((button) => button.setAttribute("aria-pressed", Number(button.dataset.value) === value ? "true" : "false"));
        };
        applySize(Number(uxSettings.previewSize) || 512);
        buttons.forEach((button) =>
            button.addEventListener("click", () => {
                const value = Number(button.dataset.value) || 512;
                saveUxSettings({ previewSize: value });
                applySize(value);
            }),
        );
    }

    const logNode = el("settings-log");
    if (logNode) logNode.textContent = readJsonStorage(LOG_STORAGE_KEY, []).join("\n");
    const clearLog = el("setting-log-clear");
    if (clearLog)
        clearLog.addEventListener("click", () => {
            writeJsonStorage(LOG_STORAGE_KEY, []);
            if (logNode) logNode.textContent = "";
        });

    const testButton = el("setting-test");
    if (testButton) testButton.addEventListener("click", () => void checkRelayHealth());
    const applyButton = el("setting-apply");
    if (applyButton)
        applyButton.addEventListener("click", () => {
            saveRelayInputs();
            void checkRelayHealth();
        });

    void checkRelayHealth();
    window.setInterval(() => void checkRelayHealth(), 5000);
}