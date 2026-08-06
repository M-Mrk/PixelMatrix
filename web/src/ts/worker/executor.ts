import { ErrorOutput } from "../../../pkg/wasm/core_engine";
import { ScriptError, WorkerMessage } from "../types";

let engine_worker: Worker | null = null;

export const init_workers = () => {
  engine_worker = new Worker(new URL('./engine.worker', import.meta.url), { type: 'module' });
}

export const execute = async (msg: WorkerMessage): Promise<ScriptError | any> => {
  if (!engine_worker) {
    throw new Error("Engine worker not yet started");
  }
  const worker = engine_worker;

  const id = crypto.randomUUID();

  return new Promise((resolve, reject) => {
    const message_handler = (event: MessageEvent) => {
      if (event.data.id !== id) return;

      worker.removeEventListener('message', message_handler);

      if (event.data.status === 'success') {
        resolve(event.data.data);
      } else if (event.data.status === 'known_error') {
        const err = new ScriptError();
        err.text = event.data.error.text;
        if (event.data.error.position) {
          err.position = event.data.error.position;
        } else {
          err.position = null;
        }

        reject(err);
      } else {
        reject(event.data.error);
      }
    };

    worker.addEventListener('message', message_handler);
    worker.postMessage({ msg: msg, id: id });
  });
}
