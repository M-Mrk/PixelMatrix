import wasm_init from "../wasm/core_engine.js"
import { init_canvas } from "./canvas.js"

document.addEventListener('DOMContentLoaded', async () => {
  await wasm_init();
  init_canvas();
});
