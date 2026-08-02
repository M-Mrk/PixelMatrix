import wasm_init from "../../pkg/wasm/core_engine.js";
import { init_state } from "./state.js";
import { init_editor } from "./editor.js";
import { init_controls } from "./controls.js";


document.addEventListener('DOMContentLoaded', async () => {
  init_state();
  init_editor();
  await wasm_init();
  init_controls();
});
