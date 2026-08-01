import { draw_pixels, clear_canvas } from "./canvas.js";
import _, { run_script, ScriptType } from "../wasm/core_engine.js"

const run_button = document.querySelector('#run-btn');
const clear_button = document.querySelector('#clear-btn');
const notification = document.querySelector('#notification-space');

const script_area = document.querySelector('#script-input');

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

  if (!script_area) {
    console.error("Script input not found");
    return;
  }
};

const run = () => {
  const res = 16;
  try {
    const pixels = run_script(script_area.value, ScriptType.Rhai, BigInt(res), BigInt(res));
    draw_pixels(pixels, res, res);
  } catch (error) {
    console.error(`Running script resulted in error: ${error.error}`);
    notification.innerText = error.error;
  }
};

const clear = () => {
  clear_canvas();
  notification.innerText = "";
}
