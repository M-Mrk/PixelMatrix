import { Output } from "../../types";

import { init, clear, deinit } from "./lifecycle";
import { run } from "./run";

export const grid: Output = {
  pipeline: run,
  clear: clear,
  init: init,
  deinit: deinit,
};
