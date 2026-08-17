import { get_element } from "./common";
import { clear_all_canvas } from "./canvas";
import { get_editor } from "./editor";
import { get_output } from "./state";
import { ScriptError } from "./types";
import { run } from "./outputs/grid/run";

const run_button = get_element<HTMLButtonElement>('#run-btn');
const clear_button = get_element<HTMLButtonElement>('#clear-btn');
const notification = get_element<HTMLDivElement>('#output-console');

export const init_controls = () => {
  run_button.addEventListener('click', () => {
    run_pipeline();
  });

  clear_button.addEventListener('click', () => {
    clear();
  })
};

export const run_pipeline = async () => {
  notification.innerText = "";
  run_button.classList.add('loading');
  run_button.disabled = true;

  const script = get_editor().getValue();
  let pipeline = get_output().pipeline;

  const result = await pipeline(script);
  if (result) {
    if (result instanceof ScriptError) {
      console.error("Running script failed: " + result.text);
      notification.innerText = result.text;
    } else {
      notification.innerText = "Pipeline error!"
    }
  }

  run_button.classList.remove('loading');
  run_button.disabled = false;
};

const clear = () => {
  clear_all_canvas();
  notification.innerText = "";
}
