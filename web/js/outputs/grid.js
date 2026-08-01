import { draw } from "../canvas.js";
import _, { run_script, ScriptType } from "../../wasm/core_engine.js";

export const run = (script, state) => {
  const res = 16;
  let pixels;
  console.time("interpreting rhai script");
  try {
    pixels = run_script(script, ScriptType.Rhai, BigInt(res), BigInt(res));
  } catch (error) {
    console.error(`Running script resulted in error: ${error.error}`);
    return error.error;
  }
  console.timeEnd("interpreting rhai script");
  draw(pixels, res, res);
}
