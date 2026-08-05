import { Output } from "../../common";

import { init, deinit } from "./lifecycle";
import { run } from "./run";

export const grid: Output = {
  pipeline: run,
  init: init,
  deinit: deinit,
};
