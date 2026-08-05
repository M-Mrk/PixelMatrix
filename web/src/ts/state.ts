import { type Output } from "./common";
import { grid } from "./outputs/grid";

export const OutputType = {
  GRID: "grid",
} as const;
export type OutputType = typeof OutputType[keyof typeof OutputType];

export const Language = {
  RHAI: "rhai",
} as const;
export type Language = typeof Language[keyof typeof Language];

export interface AppState {
  output_type: OutputType,
  language: Language,
}

const AppState = {
  output_type: OutputType.GRID,
  language: Language.RHAI,
}

export const get_state = () => AppState;

export const update_state = (new_state: AppState) => {
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

const match_output = (output_type: OutputType): Output => {
  switch (output_type) {
    case OutputType.GRID:
      return grid;

    default:
      throw new Error(`Couldn't get Output interface from output_type of ${output_type}`);
  }
  if (output_type == OutputType.GRID) {
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
