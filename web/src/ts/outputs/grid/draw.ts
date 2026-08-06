import { get_element } from "../../common";
import { output_canvas } from "../../canvas";

const hidden_canvas = get_element<HTMLCanvasElement>('#canvas-hidden');

const create_image = (pixels: Uint8ClampedArray, resolution_width: number, resolution_height: number): ImageData => {
  const needed_pixels = resolution_width * resolution_height;
  const given_pixels = pixels.length / 4; // one pixel has 4 values
  if (given_pixels != needed_pixels) {
    throw new Error(`Cannot create image - wrong amount of pixels received: ${given_pixels} when ${needed_pixels} are needed.`);
  }

  const local_pixels = new Uint8ClampedArray(pixels); // Needed to make sure pixels are saved in local memory
  const settings = {
    colorSpace: "display-p3",
    pixelFormat: "rgba-unorm8",
  } as unknown as ImageDataSettings;
  return new ImageData(local_pixels, resolution_width, resolution_height, settings);
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

export const full_draw = (pixels: Uint8ClampedArray, resolution_width: number, resolution_height: number) => {
  console.time("drawing");
  const image = create_image(pixels, resolution_width, resolution_height);
  draw_hidden_image(image, resolution_width, resolution_height);
  transfer_hidden_image();
  console.timeEnd("drawing");
};
