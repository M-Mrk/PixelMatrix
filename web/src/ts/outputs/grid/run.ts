import { settings } from "./lifecycle";
import { full_draw } from "./draw";
import { execute } from "../../worker/executor";
import { get_state } from "../../state";
import { WorkerRequest } from "../../types";
import { ErrorOutput } from "../../../../pkg/wasm/core_engine";
import { add_logs } from "../../console";

export const run = async (script: string): Promise<ErrorOutput | null> => {
  let output;
  console.time("interpreting rhai script");
  try {
    const msg: WorkerRequest = {
      script: script,
      state: get_state(),
      config: settings,
    }
    output = await execute(msg);
  } catch (error) {
    return error as ErrorOutput;
  } finally {
    console.timeEnd("interpreting rhai script");
  }
  full_draw(output, settings.res_x, settings.res_y);
  return null;
};
