import { GridSettings } from "../../../../pkg/wasm/core_engine";
import { get_element, html } from "../../common";

const settings_container = get_element<HTMLDivElement>('#output-toolbar');
const output_inner = get_element<HTMLDivElement>('#output-inner');
const id_res_x = "#setting-grid-res-x";
const id_res_y = "#setting-grid-res-y";
const id_clamp = "#setting-grid-clamp";
const id_blur = "#setting-grid-blur";

export let settings: GridSettings = {
  res_x: 16,
  res_y: 16,
  clamp: false,
  blur: false,
};

const update_settings_from_page = () => {
  const setting_res_x = get_element<HTMLInputElement>(id_res_x);
  const setting_res_y = get_element<HTMLInputElement>(id_res_y);

  if (!setting_res_x.value || !setting_res_y.value) {
    console.warn(`No resolution set. Defaulting to 16x16.`);
    settings.res_x = 16;
    settings.res_y = 16;
    return
  }

  let res_x = Number(setting_res_x.value);
  let res_y = Number(setting_res_y.value);
  if (res_x < 1 || res_y < 1) {
    console.warn(`Set resolution (${res_x}x${res_y}) is not possible. Defaulting to 16x16.`);
    res_x = 16;
    res_y = 16;
  }
  settings.res_x = res_x;
  settings.res_y = res_y;

  const setting_clamp = get_element<HTMLInputElement>(id_clamp);
  settings.clamp = setting_clamp.checked;

  const setting_blur = get_element<HTMLInputElement>(id_blur);
  settings.blur = setting_blur.checked;

  window.localStorage.setItem('grid-settings', JSON.stringify(settings));
};

const add_settings = () => {
  const saved_settings = window.localStorage.getItem('grid-settings');
  if (saved_settings) {
    settings = JSON.parse(saved_settings);
  }

  const settings_html = html`
    <label class="input-wrapper">
      Resolution:
      <label class="number" data-help="Sets the width of the output, so the x resolution"> 
        <input type="number" name="Resolution width" value="${settings.res_x}" min="1" step="1" id="${id_res_x.slice(1)}">
      </label>
        x
      <label class="number" data-help="Sets the height of the output, so the y resolution.">
      <input type="number" name="Resolution height" value="${settings.res_y}" min="1" step="1" id="${id_res_y.slice(1)}">
      </label>
    </label>
    <label class="checkbox" data-help="Will clamp output values larger than 255 to 255">
      <input type="checkbox" name="Auto clamp output" id="${id_clamp.slice(1)}">
      <span>Auto clamp output</span>
    </label>
    <label class="checkbox" data-help="Enables the browsers image smoothing, so results may vary. Works best for medium resoultions and gradients.">
      <input type="checkbox" name="Blur" id="${id_blur.slice(1)}">
      <span>Blur</span>
    </label>
    `

  if (!settings_container) {
    console.error("Settings container not found");
    return;
  }
  settings_container.innerHTML = settings_html;

  if (settings.clamp) {
    const setting_clamp = get_element<HTMLInputElement>(id_clamp);
    setting_clamp.checked = true;
  }

  if (settings.blur) {
    const setting_blur = get_element<HTMLInputElement>(id_blur);
    setting_blur.checked = true;
  }

  settings_container.addEventListener('input', update_settings_from_page);
};

const add_output = () => {
  const canvas_html = html`
    <canvas id="canvas-output" width="600" height="600"></canvas>
  `
  output_inner.innerHTML = canvas_html;
}

export const init = () => {
  add_settings();
  add_output();
};

export const clear = () => {
  const output_canvas = get_element<HTMLCanvasElement>('#canvas-output');
  const out_ctx = output_canvas.getContext("2d");
  if (!out_ctx) {
    throw new Error("could not get output_canvas context");
  }
  out_ctx.clearRect(0, 0, output_canvas.width, output_canvas.height);
}

export const deinit = () => {
  settings_container.removeEventListener('input', update_settings_from_page);
};
