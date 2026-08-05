import { ErrorOutput, run_script, ScriptType } from "../../../../pkg/wasm/core_engine";
import { settings } from "./lifecycle";
import { full_draw } from "./draw";

export const run = (script: string): ErrorOutput | null => {
  let pixels;
  console.time("interpreting rhai script");
  try {
    pixels = run_script(script, ScriptType.Rhai, BigInt(settings.resolution_x), BigInt(settings.resolution_y));
  } catch (error: unknown) {
    console.timeEnd("interpreting rhai script")
    return error as ErrorOutput;
  }
  console.timeEnd("interpreting rhai script");
  full_draw(pixels, settings.resolution_x, settings.resolution_y);
  return null;
};
