import { get_element } from "./common";
import { clear_all_canvas } from "./canvas";
import { get_editor } from "./editor";
import { get_output } from "./state";
import { show_error } from "./ui";

const run_button = get_element<HTMLButtonElement>('#run-btn');
const clear_button = get_element<HTMLButtonElement>('#clear-btn');
const middle_icon = get_element<HTMLDivElement>('#middle-icon');

export const init_controls = () => {
  run_button.addEventListener('click', () => {
    run_pipeline();
  });

  clear_button.addEventListener('click', () => {
    clear();
  });

  middle_icon.addEventListener('click', () => {
    run_pipeline();
  });
};

let running = false;
export const run_pipeline = async () => {
  if (running) {
    console.debug("pipeline already running!");
    return;
  }
  running = true;

  run_button.classList.add('loading');
  run_button.disabled = true;
  middle_icon.classList.add('loading');

  const script = get_editor().getValue();
  let pipeline = get_output().pipeline;

  const result = await pipeline(script);
  if (result) {
    console.error("Running script failed: " + result.text);
    show_error(result.text);
  }

  run_button.classList.remove('loading');
  run_button.disabled = false;
  middle_icon.classList.remove('loading');
  running = false;
};

const clear = () => {
  clear_all_canvas();
}
