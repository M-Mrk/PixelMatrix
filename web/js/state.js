import { run as grid_run } from "./outputs/grid.js";

const app_state = {
  output_type: 'grid',
}

export const get_state = () => app_state;

export const update_state = (new_state) => {
  Object.assign(app_state, new_state);
  window.localStorage.setItem("app_state", JSON.stringify(app_state));
}

export const get_pipeline = () => {
  if (app_state.output_type == "grid") {
    return grid_run;
  }
}

export const init_state = () => {
  const saved = window.localStorage.getItem("app_state");
  if (saved) {
    Object.assign(app_state, JSON.parse(saved))
  }
};
