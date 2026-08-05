import { get_element, html } from "../../common";

const settings_container = get_element<HTMLDivElement>('.output-settings-container');
const id_res_x = "#setting-grid-res-x";
const id_res_y = "#setting-grid-res-y";

export let settings = {
  resolution_x: 16,
  resolution_y: 16,
};

const update_settings_from_page = () => {
  const setting_res_x = get_element<HTMLInputElement>(id_res_x);
  const setting_res_y = get_element<HTMLInputElement>(id_res_y);

  if (!setting_res_y || !setting_res_x) {
    console.error("Setting input not found");
    return;
  }

  if (!setting_res_x.value || !setting_res_y.value) {
    console.warn(`No resolution set. Defaulting to 16x16.`);
    settings.resolution_x = 16;
    settings.resolution_y = 16;
    return
  }

  let res_x = Number(setting_res_x.value);
  let res_y = Number(setting_res_y.value);
  if (res_x < 1 || res_y < 1) {
    console.warn(`Set resolution (${res_x}x${res_y}) is not possible. Defaulting to 16x16.`);
    res_x = 16;
    res_y = 16;
  }
  settings.resolution_x = res_x;
  settings.resolution_y = res_y;

  window.localStorage.setItem('grid-settings', JSON.stringify(settings));
};

export const init = () => {
  const saved_settings = window.localStorage.getItem('grid-settings');
  if (saved_settings) {
    settings = JSON.parse(saved_settings);
  }

  const settings_html = html`
    <div>
      Resolution
      <input type="number" name="Resolution width" value="${settings.resolution_x}" min="1" step="1" id="setting-grid-res-x">
      x
      <input type="number" name="Resolution height" value="${settings.resolution_y}" min="1" step="1" id="setting-grid-res-y">
    </div>
  `

  if (!settings_container) {
    console.error("Settings container not found");
    return;
  }
  settings_container.innerHTML = settings_html;
  settings_container.addEventListener('input', update_settings_from_page);

};

export const deinit = () => {
  settings_container.removeEventListener('input', update_settings_from_page);
};
