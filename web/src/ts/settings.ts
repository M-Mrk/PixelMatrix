import { get_element } from "./common";
import { get_state, update_state } from "./state";
import { AppState, Language, OutputType } from "./types";
import { get_select_value, set_select_value } from "./ui";

const main_container = get_element<HTMLDivElement>('#top-settings');
const hot_reload_check = get_element<HTMLInputElement>('#setting-hot-reload');

export const init_settings = () => {
  const state = get_state();
  set_select_value('#setting-language', state.language);
  set_select_value('#setting-output-type', state.output_type);

  hot_reload_check.checked = state.hot_reload;

  main_container.addEventListener('input', () => { load_from_page() });
};

const load_from_page = () => {
  console.log("Settings change detected");
  let state = get_state();
  state.language = get_select_value('#setting-language') as Language;
  state.output_type = get_select_value('#setting-output-type') as OutputType;
  state.hot_reload = hot_reload_check.checked;

  update_state(state);
};
