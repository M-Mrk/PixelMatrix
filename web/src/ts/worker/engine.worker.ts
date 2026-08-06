/// <reference lib="webworker" />

import init, { run_grid, ScriptType, ErrorOutput } from "../../../pkg/wasm/core_engine";
import { WorkerMessage, AppState, OutputType, Language, ScriptError } from "../types";

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
  const { script, state, config } = event.data.msg as WorkerMessage;
  const id = event.data.id;
  const lang = convert_language(state.language);

  try {
    switch (state.output_type) {
      case OutputType.GRID:
        const pixels = run_grid(script, lang, BigInt(config.width), BigInt(config.height)); // returns a Uint8ClampedArray

        console.log("returning data for grid from engine worker");
        self.postMessage({ id, status: 'success', data: pixels }, [pixels.buffer]);
        break

      default:
        throw new Error(`Unknown output type: ${state.output_type}`);
    }
  } catch (error) {
    console.error(`returning error from engine worker`);
    if (error instanceof ErrorOutput) {
      const script_err = new ScriptError();
      script_err.text = error.text;
      if (error.position) {
        script_err.position = [error.position.line, error.position.char];
      } else {
        script_err.position = null;
      }

      self.postMessage({ id, status: 'known_error', error: script_err });
    } else {
      console.error(`WASM returned unknown error: ${error}`);
      self.postMessage({ id, status: 'unkwown_error', error: { text: error as string } });

    }
  }
}
