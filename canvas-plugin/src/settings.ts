// 节点设置浮层：目标文档、输出尺寸、中继地址都收在这里，节点下方不再挂面板。
import type { CanvasNodeContext, CanvasTheme } from "@infinite-canvas/plugin-sdk";

import { checkHealth, loadSettings, refreshDocs, saveSettings, type PsDoc, type PsSettings } from "./actions";

const MAX_EDGE_OPTIONS = [1024, 1536, 2048, 0];

function themeVars(theme: CanvasTheme): string {
    const vars: Record<string, string> = {
        "--ps-text": theme.node.text,
        "--ps-muted": theme.node.muted,
        "--ps-placeholder": theme.node.placeholder,
        "--ps-panel": theme.node.panel,
        "--ps-stroke": theme.node.stroke,
        "--ps-hover": theme.toolbar.itemHover,
        "--ps-active": theme.toolbar.activeBg,
    };
    return Object.entries(vars)
        .map(([key, value]) => `${key}:${value}`)
        .join(";");
}

function node(tag: string, className?: string, text?: string): HTMLElement {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

let current: { root: HTMLElement; close: () => void } | null = null;

export function closeSettingsOverlay(): void {
    if (!current) return;
    current.close();
    current = null;
}

/** 打开设置浮层（同一时间只保留一个）。 */
export function openSettingsOverlay(ctx: CanvasNodeContext): void {
    closeSettingsOverlay();

    const root = node("div", "ps-modal");
    root.setAttribute("style", themeVars(ctx.theme) + ";");
    const backdrop = node("div", "ps-modal__backdrop");
    const card = node("div", "ps-modal__card");

    const head = node("div", "ps-modal__head");
    const status = node("span", "ps-status");
    const dot = node("span", "ps-dot");
    const statusText = node("span", "ps-status__text", "连接中…");
    status.append(dot, statusText);
    const refreshButton = node("button", "ps-textbtn", "刷新文档") as HTMLButtonElement;
    refreshButton.type = "button";
    const closeButton = node("button", "ps-modal__close", "×") as HTMLButtonElement;
    closeButton.type = "button";
    closeButton.title = "关闭";
    head.append(status, node("span", "ps-spacer"), refreshButton, closeButton);

    const body = node("div", "ps-modal__body");

    const docLabel = node("div", "ps-modal__label", "目标文档");
    const docSelect = node("select", "ps-select") as HTMLSelectElement;
    const fallbackOption = document.createElement("option");
    fallbackOption.value = "";
    fallbackOption.textContent = "跟随当前文档";
    docSelect.appendChild(fallbackOption);

    const sizeLabel = node("div", "ps-modal__label", "输出尺寸");
    const sizeGroup = node("div", "ps-seg");
    sizeGroup.setAttribute("role", "group");
    const sizeButtons = MAX_EDGE_OPTIONS.map((value) => {
        const button = node("button", "", value === 0 ? "原图" : String(value)) as HTMLButtonElement;
        button.type = "button";
        button.dataset.value = String(value);
        sizeGroup.appendChild(button);
        return button;
    });

    const hint = node("div", "ps-modal__hint", "有选区时：取回=只取选区，推送=贴回选区；没选区时取整幅图。");

    const relay = document.createElement("details");
    relay.className = "ps-details";
    const relaySummary = document.createElement("summary");
    relaySummary.textContent = "中继地址";
    const relayBody = node("div", "ps-details__body");
    const urlInput = node("input", "ps-input") as HTMLInputElement;
    urlInput.placeholder = "http://localhost:23310";
    const tokenInput = node("input", "ps-input") as HTMLInputElement;
    tokenInput.placeholder = "token（宿主注入，可留空）";
    const relayActions = node("div", "ps-modal__row");
    const testButton = node("button", "ps-textbtn", "测试连接") as HTMLButtonElement;
    testButton.type = "button";
    relayActions.append(node("span", "ps-spacer"), testButton);
    relayBody.append(urlInput, tokenInput, relayActions);
    relay.append(relaySummary, relayBody);

    body.append(docLabel, docSelect, sizeLabel, sizeGroup, hint, relay);
    card.append(head, body);
    root.append(backdrop, card);
    document.body.appendChild(root);

    let settings: PsSettings | null = null;
    let closed = false;

    const close = () => {
        if (closed) return;
        closed = true;
        document.removeEventListener("keydown", onKeydown, true);
        root.remove();
        if (current && current.root === root) current = null;
    };
    const onKeydown = (event: KeyboardEvent) => {
        if (event.key === "Escape") close();
    };

    const applySettings = (next: PsSettings) => {
        settings = next;
        urlInput.value = next.baseUrl;
        tokenInput.value = next.token;
        sizeButtons.forEach((button) => {
            const pressed = Number(button.dataset.value) === next.maxEdge;
            button.setAttribute("aria-pressed", pressed ? "true" : "false");
        });
    };

    const update = async (patch: Partial<PsSettings>) => {
        const next = await saveSettings(ctx, patch);
        applySettings(next);
    };

    const fillDocs = (docs: PsDoc[], currentDoc: string | undefined) => {
        docSelect.innerHTML = "";
        const follow = document.createElement("option");
        follow.value = "";
        follow.textContent = "跟随当前文档";
        docSelect.appendChild(follow);
        let matched = false;
        for (const doc of docs) {
            const option = document.createElement("option");
            option.value = doc.name;
            option.textContent = `${doc.name} · ${doc.width}×${doc.height}`;
            docSelect.appendChild(option);
            if (doc.name === currentDoc) matched = true;
        }
        if (currentDoc && !matched && currentDoc !== "") {
            const option = document.createElement("option");
            option.value = currentDoc;
            option.textContent = currentDoc;
            docSelect.appendChild(option);
        }
        docSelect.value = currentDoc || "";
    };

    const loadDocs = async () => {
        if (!settings) return;
        dot.className = "ps-dot";
        statusText.textContent = "刷新中…";
        try {
            const docs = await refreshDocs(settings);
            fillDocs(docs, settings.doc);
            dot.className = "ps-dot ps-dot--ok";
            statusText.textContent = "PS 在线";
        } catch (error) {
            dot.className = "ps-dot ps-dot--error";
            statusText.textContent = `未连接：${error instanceof Error ? error.message : String(error)}`;
        }
    };

    docSelect.addEventListener("change", () => void update({ doc: docSelect.value }));
    sizeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (settings) void update({ maxEdge: Number(button.dataset.value) });
        });
    });
    urlInput.addEventListener("blur", () => {
        if (settings && urlInput.value.trim() !== settings.baseUrl) void update({ baseUrl: urlInput.value.trim() });
    });
    tokenInput.addEventListener("blur", () => {
        if (settings && tokenInput.value !== settings.token) void update({ token: tokenInput.value });
    });
    testButton.addEventListener("click", async () => {
        const health = await checkHealth(await loadSettings(ctx));
        dot.className = health?.ok ? "ps-dot ps-dot--ok" : "ps-dot ps-dot--error";
        statusText.textContent = health?.ok ? (health.photoshop?.connected ? "PS 在线" : "中继在线，PS 未连接") : "中继未连接";
    });
    refreshButton.addEventListener("click", () => void loadDocs());
    closeButton.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", onKeydown, true);

    current = { root, close };

    void (async () => {
        const loaded = await loadSettings(ctx);
        applySettings(loaded);
        await loadDocs();
    })();
}
