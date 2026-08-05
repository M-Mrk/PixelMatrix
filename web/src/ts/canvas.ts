import { get_element } from "./common";

export const output_canvas = get_element<HTMLCanvasElement>('#canvas-output');

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
};
