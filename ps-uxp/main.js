// PS 侧：面板 + 中继客户端（HTTP 长轮询，零依赖）。
// 协议见仓库根 docs/decisions.md。
//
// 已实现：连接中继、长轮询收命令、docs 命令（列出文档）。
// 待实现：push（贴成新图层）、pull（导出整幅 PNG）。实现要点见 README。

const { entrypoints } = require("uxp");
const { app } = require("photoshop");

const RELAY_STORAGE_KEY = "ps-node:relay";
const POLL_TIMEOUT_MS = 25000;

const relay = { url: "http://localhost:23310", token: "" };
let polling = false;

function el(id) {
    return document.getElementById(id);
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
        void startPolling();
    } catch (error) {
        setStatus(false, "连接失败");
        log(`连接失败：${error && error.message ? error.message : error}`);
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
        } catch (error) {
            setStatus(false, "已断开");
            log(`长轮询中断：${error && error.message ? error.message : error}`);
            await sleep(2000);
        }
    }
}

async function handle(command, payload) {
    try {
        if (command === "ping") return { ok: true, data: { pong: true } };
        if (command === "docs") {
            const docs = app.documents.map((doc) => ({ name: doc.name, width: doc.width, height: doc.height }));
            return { ok: true, data: { docs } };
        }
        // TODO: push —— 写临时 PNG → createSessionToken → batchPlay placeEvent → 改图层名
        // TODO: pull —— 副本 flatten/resize → saveAs.png → 读字节 → base64
        return { ok: false, error: `PS 侧尚未实现：${command}` };
    } catch (error) {
        return { ok: false, error: error && error.message ? error.message : String(error) };
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

entrypoints.setup({
    panels: {
        psNodePanel: {
            show() {
                loadRelay();
            },
        },
    },
});

document.addEventListener("DOMContentLoaded", () => {
    loadRelay();
    setStatus(false, "未连接");
    const connectButton = el("connect");
    if (connectButton) connectButton.addEventListener("click", () => void connect());
    const docsButton = el("docs");
    if (docsButton) docsButton.addEventListener("click", () => void showDocs());
});
