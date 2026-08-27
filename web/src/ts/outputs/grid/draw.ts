import { GridSettings } from "../../../../pkg/wasm/core_engine";
import { get_element } from "../../common";

const create_image = (pixels: Uint8ClampedArray, settings: GridSettings): ImageData => {
  const needed_pixels = settings.res_x * settings.res_y;
  const given_pixels = pixels.length / 4; // one pixel has 4 values
  if (given_pixels != needed_pixels) {
    throw new Error(`Cannot create image - wrong amount of pixels received: ${given_pixels} when ${needed_pixels} are needed.`);
  }

  const local_pixels = new Uint8ClampedArray(pixels); // Needed to make sure pixels are saved in local memory
  const picture_settings = {
    colorSpace: "display-p3",
    pixelFormat: "rgba-unorm8",
  } as unknown as ImageDataSettings;
  return new ImageData(local_pixels, settings.res_x, settings.res_y, picture_settings);
};

const draw_hidden_image = (canvas: OffscreenCanvas, image: ImageData) => {
  const ctx = canvas.getContext("2d");
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

const transfer_hidden_image = (canvas: OffscreenCanvas, settings: GridSettings) => {
  const output_canvas = get_element<HTMLCanvasElement>('#canvas-output');

  const ctx = output_canvas.getContext("2d");
  if (!ctx) {
    throw new Error("could not get output_canvas context");
  }
  ctx.imageSmoothingEnabled = settings.blur;
  ctx.drawImage(canvas, 0, 0, output_canvas.width, output_canvas.height);
}

export const full_draw = (pixels: Uint8ClampedArray, settings: GridSettings) => {
  console.time("drawing");
  const image = create_image(pixels, settings);
  const hidden_canvas = new OffscreenCanvas(settings.res_x, settings.res_y);
  draw_hidden_image(hidden_canvas, image);
  transfer_hidden_image(hidden_canvas, settings);
  console.timeEnd("drawing");
};
