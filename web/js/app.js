import wasm_init from "../wasm/core_engine.js"
import { init_controls } from "./controls.js";

document.addEventListener('DOMContentLoaded', async () => {
  await wasm_init();
  init_controls();
});
