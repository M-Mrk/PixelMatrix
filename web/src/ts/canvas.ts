import { Pixel } from "../../pkg/wasm/core_engine";
import { get_element } from "./common";

const output_canvas = get_element<HTMLCanvasElement>('#canvas-output');
const hidden_canvas = get_element<HTMLCanvasElement>('#canvas-hidden');

const draw_pixel = (color: string, x: number, y: number, resolution_width: number, resolution_height: number) => {
  const pixel_width = output_canvas.width / resolution_width;
  const pixel_height = output_canvas.height / resolution_height;
  const pixel_x = x * pixel_width;
  const pixel_y = y * pixel_height;

  const ctx = output_canvas.getContext("2d");
  if (!ctx) {
    throw new Error("could not get output_canvas context");
  }

  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = color;
  ctx.fillRect(pixel_x, pixel_y, pixel_width, pixel_height);
};

const draw_pixels = (pixels: Pixel[], resolution_width: number, resolution_height: number) => {
  if (pixels.length != resolution_width * resolution_height) {
    throw new Error("Did not receive enough pixels");
  }

  let i_pixel = 0;
  for (let row = 0; row < resolution_height; row++) {
    for (let column = 0; column < resolution_width; column++) {
      const pixel = pixels[i_pixel];
      if (!pixel) throw new Error(`pixel at index ${i_pixel} / position ${column}|${row} is missing`);

      const color = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
      draw_pixel(color, column, row, resolution_width, resolution_height);
      i_pixel += 1;
    }
  }
}

const create_image = (pixels: Pixel[], resolution_width: number, resolution_height: number): ImageData => {
  const image_size = resolution_width * resolution_height * 4; // RGBA - 4 bytes
  const needed_pixels = resolution_width * resolution_height;
  const given_pixels = pixels.length;
  if (given_pixels > needed_pixels) {
    throw new Error(`Cannot create image - too many pixels received: ${given_pixels} when only ${needed_pixels} are needed.`);
  }

  let buf = new Uint8ClampedArray(image_size);
  let i_buf = 0;
  for (let i_pixel = 0; i_pixel < pixels.length; i_pixel++) {
    const pixel = pixels[i_pixel];
    if (!pixel) throw new Error(`pixel at index ${i_pixel} is missing`);

    buf[i_buf] = pixel.r;
    buf[i_buf + 1] = pixel.g;
    buf[i_buf + 2] = pixel.b;
    buf[i_buf + 3] = 255; // Fully opaque
    i_buf += 4;
  }

  const missing_pixels = needed_pixels - given_pixels;
  for (let i_pixel = 0; i_pixel < missing_pixels; i_pixel++) {
    buf[i_buf] = 0;
    buf[i_buf + 1] = 0;
    buf[i_buf + 2] = 0;
    buf[i_buf + 3] = 255;
    i_buf += 4;
  }

  const settings = {
    colorSpace: "display-p3",
    pixelFormat: "rgba-unorm8",
  } as unknown as ImageDataSettings;
  return new ImageData(buf, resolution_width, resolution_height, settings);
};

const draw_hidden_image = (image: ImageData, resolution_width: number, resolution_height: number) => {
  if (!hidden_canvas) {
    console.error("Hidden canvas not found.");
    return;
  }
  hidden_canvas.width = resolution_width;
  hidden_canvas.height = resolution_height;

  const ctx = hidden_canvas.getContext("2d");
  if (!ctx) {
    throw new Error("could not get hidden_canvas context");
  }
  ctx.imageSmoothingEnabled = false;
  ctx.putImageData(
    image,
    0, // destination start x
    0, // destination start y
  );
}

const transfer_hidden_image = () => {
  if (!hidden_canvas) {
    console.error("Hidden canvas not found.");
    return;
  }
  if (!output_canvas) {
    console.error("Output canvas not found.");
    return;
  }

  const ctx = output_canvas.getContext("2d");
  if (!ctx) {
    throw new Error("could not get output_canvas context");
  }
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(hidden_canvas, 0, 0, output_canvas.width, output_canvas.height);
}

export const clear_all_canvas = () => {
  if (!output_canvas) {
    console.error("Canvas not found.");
    return;
  }
  const out_ctx = output_canvas.getContext("2d");
  if (!out_ctx) {
    throw new Error("could not get output_canvas context");
  }
  out_ctx.clearRect(0, 0, output_canvas.width, output_canvas.height);

  if (!hidden_canvas) {
    console.error('Hidden canvas not found.');
    return;
  }
  const hidden_ctx = hidden_canvas.getContext("2d");
  if (!hidden_ctx) {
    throw new Error("could not get hidden_canvas context");
  }
  hidden_ctx.clearRect(0, 0, hidden_canvas.width, hidden_canvas.height);
};

export const draw = (pixels: Pixel[], resolution_width: number, resolution_height: number) => {
  if (!output_canvas) {
    console.error("Canvas not found.");
    return;
  }

  // draw_pixels(pixels, resolution_width, resolution_height);
  console.time("drawing");
  const image = create_image(pixels, resolution_width, resolution_height);
  draw_hidden_image(image, resolution_width, resolution_height);
  transfer_hidden_image();

  console.timeEnd("drawing");
};
