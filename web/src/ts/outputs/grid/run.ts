import { settings } from "./lifecycle";
import { full_draw } from "./draw";
import { execute } from "../../worker/executor";
import { get_state } from "../../state";
import { WorkerRequest } from "../../types";
import { ErrorOutput } from "../../../../pkg/wasm/core_engine";

export const run = async (script: string): Promise<ErrorOutput | null> => {
  console.log("here");
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
    if (error && typeof error === "object" && "text" in error && "position" in error) {
      return error as ErrorOutput;
    }
    console.timeEnd("interpreting rhai script");
    const unexpected_err: ErrorOutput = {
      text: String(error),
      position: undefined,
    }
    return unexpected_err;
  }
  console.timeEnd("interpreting rhai script");
  full_draw(output, settings.res_x, settings.res_y);
  return null;
};
