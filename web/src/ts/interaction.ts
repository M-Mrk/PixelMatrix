import { get_element, spinner_html } from "./common";
import { clear_all_canvas } from "./canvas";
import { get_editor } from "./editor";
import { get_output } from "./state";

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
  notification.innerText = "";

  run_button.innerHTML = spinner_html;

  const script = get_editor().getValue();
  let pipeline = get_output().pipeline;

  const result = pipeline(script);
  if (result) {
    console.error("Running script failed: " + result.text);
    notification.innerText = result.text;
  }

  run_button.innerText = "Run";
};

const clear = () => {
  clear_all_canvas();
  notification.innerText = "";
}
