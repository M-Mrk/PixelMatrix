/// <reference lib="webworker" />

import init, { run_grid, ScriptType, ErrorOutput } from "../../../pkg/wasm/core_engine";
import { WorkerRequest, WorkerResponse, WorkerStatus, OutputType, Language } from "../types";

let wasm_loaded = init();

const convert_language = (lang: Language): ScriptType => {
  switch (lang) {
    case Language.RHAI:
      return ScriptType.Rhai;

    default:
      throw new Error(`Could not convert ${lang} to a ScriptType for WASM`);
  }
}

self.onmessage = async (event) => {
  console.log("received message");
  await wasm_loaded;
  const req = event.data as WorkerRequest;
  const lang = convert_language(req.state.language);

  try {
    switch (req.state.output_type) {
      case OutputType.GRID:
        const output = run_grid(req.script, lang, req.config);

        console.log("returning data for grid from engine worker");
        const response: WorkerResponse = {
          status: WorkerStatus.SUCCESS,
          data: output.pixels,
          logs: output.logs,
          id: req.id as string,
        }
        self.postMessage(response, [output.pixels.buffer]);
        break

      default:
        throw new Error(`Unknown output type: ${req.state.output_type}`);
    }
  } catch (error) {
    console.error(`returning error from engine worker`);
    if (typeof error === 'object' && error != null && 'text' in error) {
      const response: WorkerResponse = {
        status: WorkerStatus.ERROR,
        error: error as ErrorOutput,
        logs: [],
        id: req.id as string,
      }
      self.postMessage(response);
    } else {
      console.error(`WASM returned unknown error: ${error}`);
      const response: WorkerResponse = {
        status: WorkerStatus.FAILURE,
        error: error as string,
        id: req.id as string,
      }
      self.postMessage(response);
    }
  }
}
