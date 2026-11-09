// 后台 worker：领取 PS 面板发来的请求（生成 / 模型列表），交给画布宿主 AI 执行。
// 协议见仓库根 docs/decisions.md。
import type { CanvasNodeContext } from "@infinite-canvas/plugin-sdk";

import { readPsDoc } from "./actions";
import { completePsJob, nextPsJob, relayEndpoint, type PsJob } from "./relay";

type GenPayload = {
    prompt?: string;
    model?: string;
    reference?: string;
    doc?: string;
    image?: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function readMeta(ctx: CanvasNodeContext, key: string): string {
    const value = ctx.node.metadata?.[key];
    return typeof value === "string" ? value : "";
}

function errorText(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

async function handleJob(ctx: CanvasNodeContext, job: PsJob): Promise<{ ok: boolean; data?: unknown; error?: string }> {
    const payload = (job.payload ?? {}) as GenPayload;
    try {
        if (job.command === "ping") return { ok: true, data: { pong: true } };

        if (job.command === "models") {
            return {
                ok: true,
                data: {
                    models: ctx.ai.listModels("image"),
                    defaultModel: ctx.ai.defaultModel("image"),
                },
            };
        }

        if (job.command === "latest") {
            const content = readMeta(ctx, "content");
            return { ok: true, data: { image: content, doc: readPsDoc(ctx) } };
        }

        if (job.command === "sync") {
            const image = typeof payload.image === "string" ? payload.image : "";
            if (!image) return { ok: false, error: "缺少图片数据" };
            ctx.updateMetadata({
                content: image,
                psStatus: "inPS",
                psDoc: typeof payload.doc === "string" && payload.doc ? payload.doc : readPsDoc(ctx),
                psStartedAt: Date.now(),
                psError: "",
            });
            return { ok: true, data: { synced: true } };
        }

        if (job.command === "generate") {
            const prompt = typeof payload.prompt === "string" ? payload.prompt.trim() : "";
            if (!prompt) return { ok: false, error: "提示词为空" };
            const references = typeof payload.reference === "string" && payload.reference ? [payload.reference] : [];
            const model = typeof payload.model === "string" && payload.model ? payload.model : undefined;
            const generated = await ctx.ai.generateImage(prompt, { model, references });
            const image = generated.images[0];
            if (!image) return { ok: false, error: "AI 没有返回图片" };
            ctx.updateMetadata({
                content: image,
                psStatus: "done",
                psDoc: typeof payload.doc === "string" && payload.doc ? payload.doc : readPsDoc(ctx),
                psStartedAt: Date.now(),
                psError: "",
            });
            return { ok: true, data: { image } };
        }

        return { ok: false, error: `未知请求：${job.command}` };
    } catch (error) {
        return { ok: false, error: `生成失败：${errorText(error)}` };
    }
}

/**
 * 启动 PS 请求 worker，返回停止函数。
 * getCtx 每次取当前节点上下文（组件重渲染后引用会变）。
 */
export function startPsRequestWorker(getCtx: () => CanvasNodeContext | null): () => void {
    let stopped = false;
    const controller = new AbortController();

    const loop = async () => {
        while (!stopped) {
            try {
                const ctx = getCtx();
                if (!ctx) {
                    await sleep(1000);
                    continue;
                }
                const endpoint = relayEndpoint();
                // 中继地址/token 等宿主注入；没注入时静默等，别刷 401。
                if (!endpoint.token) {
                    await sleep(2000);
                    continue;
                }
                let job: PsJob | null = null;
                try {
                    job = await nextPsJob(endpoint, controller.signal);
                } catch (error) {
                    if (stopped) return;
                    await sleep(2000);
                    continue;
                }
                if (!job) continue;
                const result = await handleJob(getCtx() ?? ctx, job);
                await completePsJob(endpoint, job.id, result);
            } catch (error) {
                if (stopped) return;
                await sleep(2000);
            }
        }
    };

    void loop();
    return () => {
        stopped = true;
        controller.abort();
    };
}
