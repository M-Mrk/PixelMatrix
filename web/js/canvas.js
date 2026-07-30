import _, { run_script, Pixel, ScriptType } from "../wasm/core_engine.js"

const canvas_element = document.querySelector('#canvas-output');
const run_button = document.querySelector('#run-btn');
const clear_button = document.querySelector('#clear-btn');

export const init_canvas = () => {
  if (!run_button) {
    console.error("Failed to find run button");
    return
  }

  run_button.addEventListener("click", () => {
    const res = 16;
    const pixels = run_script("", ScriptType.Rhai, BigInt(res), BigInt(res));
    draw_pixels(pixels, res, res);
  });

  if (!clear_button) {
    console.error("Failed to find clear button");
    return
  }
  clear_button.addEventListener("click", () => {
    clear();
  });
}

const draw_pixel = (color, x, y, resolution_width, resolution_height) => {
  const pixel_width = canvas_element.width / resolution_width;
  const pixel_height = canvas_element.height / resolution_height;
  const pixel_x = x * pixel_width;
  const pixel_y = y * pixel_height;

  const ctx = canvas_element.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(pixel_x, pixel_y, pixel_width, pixel_height);
}

const clear = () => {
  if (!canvas_element) {
    console.error("Failed to find canvas.");
    return
  }
  const ctx = canvas_element.getContext("2d");
  ctx.clearRect(0, 0, canvas_element.width, canvas_element.height);
}

export const draw_pixels = (pixels, resolution_width, resolution_height) => {
  let i_pixel = 0;
  console.log(pixels[0]);
  for (let row = 0; row < resolution_height; row++) {
    for (let column = 0; column < resolution_width; column++) {
      const pixel = pixels[i_pixel];
      const color = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
      draw_pixel(color, column, row, resolution_width, resolution_height);
      i_pixel += 1;
    }
  }
  console.debug(`Done drawing ${i_pixel} pixels`);
}

const show_test_grid = () => {
  if (!canvas_element) {
    console.error("Failed to find canvas.");
    return
  }
  const res = 8;
  for (let row = 0; row < res; row++) {
    for (let column = 0; column < res; column++) {
      if ((row + column) % 2 == 0) {
        draw_pixel(`rgb(${(column + 1) * 25}, 255, ${(row + 1) * 25})`, column, row, res, res);
      }
    }
  }
}

