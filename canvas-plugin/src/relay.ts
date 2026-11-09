// 与宿主 Electron 主进程里的「PS 中继」通信（零依赖 HTTP 长轮询）。
// 协议见仓库根目录 docs/decisions.md。

export type RelayEndpoint = { baseUrl: string; token: string };

export type RelayHealth = {
    ok: boolean;
    version?: string;
    photoshop?: { connected: boolean; doc?: string | null };
};

export type RelayResult<T = unknown> = { ok: true; data: T } | { ok: false; error: string };

type RuntimeConfig = { psRelay?: { url?: string; token?: string } };

export const DEFAULT_BASE_URL = "http://localhost:23310";

const POLL_TIMEOUT_MS = 25_000;

/** 宿主（canvas-agent）注入的中继地址与 token；没注入就是没连上。 */
export function readInjectedEndpoint(): { baseUrl?: string; token?: string } {
    const injected = (typeof window === "undefined" ? undefined : (window as { __RUNTIME_CONFIG__?: RuntimeConfig }).__RUNTIME_CONFIG__)?.psRelay;
    return { baseUrl: injected?.url, token: injected?.token };
}

export function normalizeBaseUrl(url: string | undefined): string {
    const trimmed = (url ?? "").trim().replace(/\/+$/, "");
    return trimmed || DEFAULT_BASE_URL;
}

export const NO_RELAY_MESSAGE = "PS 中继未就绪：确认画布是从宿主打开的、canvas-agent 在运行，然后刷新页面";

/**
 * 中继地址与 token 一律跟随宿主注入，插件不再有手填入口。
 * 旧版本存过的 token 不再参与，避免中继换了 token 后一直 401。
 */
export function relayEndpoint(): RelayEndpoint {
    const injected = readInjectedEndpoint();
    return { baseUrl: normalizeBaseUrl(injected.baseUrl), token: injected.token ?? "" };
}

export async function health(endpoint: RelayEndpoint): Promise<RelayHealth> {
    if (!endpoint.token) throw new Error(NO_RELAY_MESSAGE);
    const response = await fetch(`${endpoint.baseUrl}/api/health`, { cache: "no-store", headers: { "x-relay-token": endpoint.token }, signal: AbortSignal.timeout(3000) });
    if (!response.ok) throw new Error(`中继未响应（${response.status}）`);
    return (await response.json()) as RelayHealth;
}

async function readJson<T>(response: Response, what: string): Promise<T> {
    if (response.status === 204) throw new Error(`${what}超时`);
    if (!response.ok) throw new Error(`${what}失败（${response.status}）`);
    return (await response.json()) as T;
}

/** 投递一条命令给 PS，并长轮询等待 PS 回填结果。 */
export async function runCommand<T>(endpoint: RelayEndpoint, command: string, payload: unknown, timeoutMs = 120_000): Promise<T> {
    if (!endpoint.token) throw new Error(NO_RELAY_MESSAGE);
    const response = await fetch(`${endpoint.baseUrl}/api/command`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-relay-token": endpoint.token },
        body: JSON.stringify({ command, payload }),
    });
    const { id } = await readJson<{ id: string }>(response, "投递命令");

    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        const polled = await fetch(`${endpoint.baseUrl}/api/result?id=${encodeURIComponent(id)}&timeout=${POLL_TIMEOUT_MS}`, {
            cache: "no-store",
            headers: { "x-relay-token": endpoint.token },
        });
        if (polled.status === 204) continue;
        const body = await readJson<RelayResult<T>>(polled, "等待 PS");
        if (!body.ok) throw new Error(body.error || "PS 返回失败");
        return body.data;
    }
    throw new Error("等待 PS 响应超时");
}

// ---------------------------------------------------------------------------
// 反向通道：PS 向画布发起请求（生成 / 模型列表）
// ---------------------------------------------------------------------------

export type PsJob = { id: string; command: string; payload: Record<string, unknown> | null };

/** 画布侧长轮询领取 PS 发来的请求；超时返回 null。 */
export async function nextPsJob(endpoint: RelayEndpoint, signal?: AbortSignal, timeoutMs = 25_000): Promise<PsJob | null> {
    const response = await fetch(`${endpoint.baseUrl}/api/ps/next?timeout=${timeoutMs}`, {
        cache: "no-store",
        headers: { "x-relay-token": endpoint.token },
        signal,
    });
    if (response.status === 204) return null;
    if (!response.ok) throw new Error(`中继返回 ${response.status}`);
    return (await response.json()) as PsJob;
}

/** 把 PS 请求的结果回填给中继。 */
export async function completePsJob(endpoint: RelayEndpoint, id: string, result: { ok: boolean; data?: unknown; error?: string }): Promise<void> {
    const response = await fetch(`${endpoint.baseUrl}/api/ps/result`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-relay-token": endpoint.token },
        body: JSON.stringify({ id, ...result }),
    });
    if (!response.ok) throw new Error(`回填请求结果失败（${response.status}）`);
}
