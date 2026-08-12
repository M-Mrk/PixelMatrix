import { get_element } from "./common";
import { get_state, update_state } from "./state";
import { AppState, Language, OutputType } from "./types";

const main_container = get_element<HTMLDivElement>('.general-settings-container');
const language_select = get_element<HTMLSelectElement>('#setting-language');
const output_select = get_element<HTMLSelectElement>('#setting-output-type');

const second_container = get_element<HTMLDivElement>('.controls-container');
const hot_reload_check = get_element<HTMLInputElement>('#setting-hot-reload');

export const init_settings = () => {
  const state = get_state();
  language_select.value = state.language;
  output_select.value = state.output_type;

  hot_reload_check.checked = state.hot_reload;

  main_container.addEventListener('input', () => { load_from_page() });
  second_container.addEventListener('input', () => { load_from_page() });
};

const load_from_page = () => {
  console.log("Settings change detected");
  let state = get_state();
  state.language = language_select.value as Language;
  state.output_type = output_select.value as OutputType;
  state.hot_reload = hot_reload_check.checked;

  update_state(state);
};
