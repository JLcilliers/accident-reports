import { put, type PutBlobResult, type PutCommandOptions } from "@vercel/blob";

/**
 * put() that gives up at `deadline` (epoch ms), with at least 10 s to try, or after 60 s when there is no
 * deadline. The Blob SDK retries server and network errors for many minutes, retries its own timeouts, and
 * sleeps between retries without watching the abort signal, so the race below is what actually ends the wait.
 */
export async function putBefore(
  deadline: number,
  pathname: string,
  body: Parameters<typeof put>[1],
  options: PutCommandOptions
): Promise<PutBlobResult> {
  const controller = new AbortController();
  const limitMs = Number.isFinite(deadline) ? Math.max(10_000, deadline - Date.now()) : 60_000;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      put(pathname, body, { ...options, abortSignal: controller.signal }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new Error(`Blob did not answer within ${Math.round(limitMs / 1000)} s`));
        }, limitMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
