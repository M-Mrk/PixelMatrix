import { get as get_grid } from "./outputs/grid.js";

export const OutputType = Object.freeze({
  GRID: "grid",
});

export const Language = Object.freeze({
  RHAI: "rhai",
});

const AppState = {
  output_type: OutputType.GRID,
  language: Language.RHAI,
}

export const get_state = () => AppState;

export const update_state = (new_state) => {
  const prior_state = AppState;

  Object.assign(AppState, new_state);

  if (prior_state.output_type != AppState.output_type) {
    const old_output = match_output(prior_state.output_type);
    old_output.deinit();

    const new_output = match_output(AppState.output_type);
    new_output.init();
  }

  window.localStorage.setItem("AppState", JSON.stringify(AppState));
}

export const get_output = () => {
  return match_output(AppState.output_type);
}

const match_output = (output_type) => {
  if (output_type == OutputType.GRID) {
    return get_grid();
  }
}

export const init_state = () => {
  const saved = window.localStorage.getItem("AppState");
  if (saved) {
    update_state(JSON.parse(saved));
  }

  const output = match_output(AppState.output_type);
  output.init();
};
