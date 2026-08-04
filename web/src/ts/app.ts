import wasm_init from "../../pkg/wasm/core_engine";
import { init_state } from "./state";
import { init_editor } from "./editor";
import { init_controls } from "./interaction";

document.addEventListener('DOMContentLoaded', async () => {
  init_state();
  init_editor();
  await wasm_init();
  init_controls();
});
