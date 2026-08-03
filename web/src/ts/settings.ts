import { get_element } from "./common";

const container = get_element<HTMLDivElement>('.general-settings-container');

const language_select = get_element<HTMLSelectElement>('#setting-language');
const output_select = get_element<HTMLSelectElement>('#setting-output-type');

export const init_settings = () => {
  container.addEventListener('input', () => { load_from_page() });
};

const load_from_page = () => {
  console.log("Settings change detected");
  if (!language_select) {
    console.error("language setting not found");
    return;
  }

};
