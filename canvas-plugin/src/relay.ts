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

/** 宿主（Electron）注入的中继地址与 token；纯浏览器开发时为空。 */
export function readInjectedEndpoint(): { baseUrl?: string; token?: string } {
    const injected = (typeof window === "undefined" ? undefined : (window as { __RUNTIME_CONFIG__?: RuntimeConfig }).__RUNTIME_CONFIG__)?.psRelay;
    return { baseUrl: injected?.url, token: injected?.token };
}

export function normalizeBaseUrl(url: string | undefined): string {
    const trimmed = (url ?? "").trim().replace(/\/+$/, "");
    return trimmed || DEFAULT_BASE_URL;
}

export async function health(endpoint: RelayEndpoint): Promise<RelayHealth> {
    const response = await fetch(`${endpoint.baseUrl}/api/health`, { cache: "no-store", headers: { "x-relay-token": endpoint.token } });
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
