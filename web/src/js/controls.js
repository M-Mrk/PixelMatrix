import { clear_all_canvas } from "./canvas.js";
import { get_editor } from "./editor.js";
import { get_output } from "./state.js";

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
  const script = get_editor().getValue();
  let pipeline = get_output().pipeline;

  const result = pipeline(script);
  if (result) {
    notification.innerText = result;
  }
};

const clear = () => {
  clear_all_canvas();
  notification.innerText = "";
}
