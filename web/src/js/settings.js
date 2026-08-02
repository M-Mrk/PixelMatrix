const container = document.querySelector('.general-settings-container');

const language_input = document.querySelector('#setting-language');
const output_input = document.querySelector('#setting-output-type');
const defaults_btn = document.querySelector('#setting-reset-btn');

export const init_settings = () => {
  if (!container) {
    console.error("General settings container not found");
    return;
  }
  container.addEventListener('input', () => { load_from_page() });
};

const load_from_page = () => {
  console.log("Settings change detected");
  if (!language_input) {
    console.error("language setting not found");
    return;
  }

};
