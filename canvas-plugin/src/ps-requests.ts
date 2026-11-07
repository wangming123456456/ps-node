// 后台 worker：领取 PS 面板发来的请求（生成 / 模型列表），交给画布宿主 AI 执行。
// 协议见仓库根 docs/decisions.md。
import type { CanvasNodeContext } from "@infinite-canvas/plugin-sdk";

import { loadSettings, readPsDoc } from "./actions";
import { completePsJob, nextPsJob, type PsJob } from "./relay";

type GenPayload = {
    prompt?: string;
    model?: string;
    reference?: string;
    doc?: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
                const settings = await loadSettings(ctx);
                const endpoint = { baseUrl: settings.baseUrl, token: settings.token };
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
