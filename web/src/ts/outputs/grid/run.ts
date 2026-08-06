import { ErrorOutput } from "../../../../pkg/wasm/core_engine";
import { settings } from "./lifecycle";
import { full_draw } from "./draw";
import { execute } from "../../worker/executor";
import { WorkerMessage } from "../../types";
import { get_state } from "../../state";

export const run = async (script: string): Promise<any | null> => {
  let pixels;
  console.time("interpreting rhai script");
  try {
    const msg: WorkerMessage = {
      script: script,
      state: get_state(),
      config: {
        width: settings.resolution_x,
        height: settings.resolution_y,
      }
    }
    pixels = await execute(msg);
  } catch (error) {
    console.timeEnd("interpreting rhai script")
    return error;
  }
  console.timeEnd("interpreting rhai script");
  full_draw(pixels, settings.resolution_x, settings.resolution_y);
  return null;
};
