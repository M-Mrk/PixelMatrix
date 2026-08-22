import { ErrorOutput } from "../../../pkg/wasm/core_engine";
import { OutputOutputs, WorkerRequest, WorkerResponse, WorkerStatus } from "../types";

let engine_worker: Worker | null = null;

export const init_workers = () => {
  engine_worker = new Worker(new URL('./engine.worker', import.meta.url), { type: 'module' });
}

export const execute = async (req: WorkerRequest): Promise<OutputOutputs> => {
  if (!engine_worker) {
    throw new Error("Engine worker not yet started");
  }
  const worker = engine_worker;

  req.id = crypto.randomUUID();

  return new Promise((resolve, reject) => {
    const message_handler = (event: MessageEvent) => {
      const response = event.data as WorkerResponse;
      if (response.id !== req.id) return;

      worker.removeEventListener('message', message_handler);

      if (response.status === WorkerStatus.SUCCESS) {
        resolve(response.data);
      } else if (response.status === WorkerStatus.ERROR) {
        reject(response.error);
      } else if (response.status === WorkerStatus.FAILURE) {
        reject(response.error);
      } else {
        console.error("Encountered unexpected return from engine Web Worker");
        throw new Error(response);
      }
    };

    worker.addEventListener('message', message_handler);
    worker.postMessage(req);
  });
}
