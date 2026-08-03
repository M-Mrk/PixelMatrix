import { get_element } from "./common";
import { clear_all_canvas } from "./canvas.js";
import { get_editor } from "./editor.js";
import { get_output } from "./state.js";

const run_button = get_element<HTMLButtonElement>('#run-btn');
const clear_button = get_element<HTMLButtonElement>('#clear-btn');
const notification = get_element<HTMLDivElement>('#notification-space');

export const init_controls = () => {
  run_button.addEventListener('click', () => {
    run();
  });

  clear_button.addEventListener('click', () => {
    clear();
  })
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
