const canvas_element = document.querySelector('#canvas-output');

const draw_pixel = (color, x, y, resolution_width, resolution_height) => {
  const pixel_width = canvas_element.width / resolution_width;
  const pixel_height = canvas_element.height / resolution_height;
  const pixel_x = x * pixel_width;
  const pixel_y = y * pixel_height;

  const ctx = canvas_element.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(pixel_x, pixel_y, pixel_width, pixel_height);
};

export const clear_canvas = () => {
  if (!canvas_element) {
    console.error("Canvas not found.");
    return;
  }
  const ctx = canvas_element.getContext("2d");
  ctx.clearRect(0, 0, canvas_element.width, canvas_element.height);
};

export const draw_pixels = (pixels, resolution_width, resolution_height) => {
  if (!canvas_element) {
    console.error("Canvas not found.");
    return;
  }

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
};
