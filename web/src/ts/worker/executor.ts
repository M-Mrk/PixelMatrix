import { ErrorOutput } from "../../../pkg/wasm/core_engine";
import { add_logs, clear_console } from "../console";
import { OutputOutputs, WorkerRequest, WorkerResponse, WorkerStatus } from "../types";

let engine_worker: Worker | null = null;

export const init_workers = () => {
  engine_worker = new Worker(new URL('./engine.worker', import.meta.url), { type: 'module' });
}

let worker_occupied: boolean = false;
const await_free_worker = async (): Promise<boolean> => {
  if (!worker_occupied) {
    return true;
  }
  console.info("Awaiting worker to be freed");
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!worker_occupied) {
        console.info("Continuing as worker is now free");
        clearInterval(interval);
        resolve(true);
      }
    }, 100);
  });
}

export const execute = async (req: WorkerRequest): Promise<OutputOutputs> => {
  if (!engine_worker) {
    throw new Error("Engine worker not yet started");
  }
  await await_free_worker();
  worker_occupied = true;
  try {
    const worker = engine_worker;

    req.id = crypto.randomUUID();

    return new Promise((resolve, reject) => {
      const message_handler = (event: MessageEvent) => {
        const response = event.data as WorkerResponse;
        if (response.id !== req.id) return;

        worker.removeEventListener('message', message_handler);

        if (response.status === WorkerStatus.SUCCESS) {
          clear_console() // TODO: refactor to correct position
          add_logs(response.logs)
          resolve(response.data);
        } else if (response.status === WorkerStatus.ERROR) {
          clear_console() // TODO: refactor to correct position
          add_logs(response.error.logs)
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
  } finally {
    worker_occupied = false;
  }
}
