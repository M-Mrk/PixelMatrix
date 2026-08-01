import wasm_init from "../wasm/core_engine.js";
import { init_editor } from "./editor.js";
import { init_controls } from "./controls.js";


document.addEventListener('DOMContentLoaded', async () => {
  init_editor();
  await wasm_init();
  init_controls();
});
