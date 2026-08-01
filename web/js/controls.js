import { draw, clear_all_canvas } from "./canvas.js";
import { get_editor } from "./editor.js";
import _, { run_script, ScriptType } from "../wasm/core_engine.js"

const run_button = document.querySelector('#run-btn');
const clear_button = document.querySelector('#clear-btn');
const notification = document.querySelector('#notification-space');

export const init_controls = () => {
  if (!run_button) {
    console.error("Run button not found.");
    return;
  }
  run_button.addEventListener('click', () => {
    run();
  });

  if (!clear_button) {
    console.error("Clear button not found.");
    return;
  }
  clear_button.addEventListener('click', () => {
    clear();
  })

  if (!notification) {
    console.error("notification space not found.");
    return;
  }
};

const run = () => {
  const res = 16;
  let pixels;
  console.time("interpreting script");
  try {
    let editor = get_editor();
    pixels = run_script(editor.getValue(), ScriptType.Rhai, BigInt(res), BigInt(res));
  } catch (error) {
    console.error(`Running script resulted in error: ${error.error}`);
    notification.innerText = error.error;
  }
  console.timeEnd("interpreting script");
  draw(pixels, res, res);
};

const clear = () => {
  clear_all_canvas();
  notification.innerText = "";
}
