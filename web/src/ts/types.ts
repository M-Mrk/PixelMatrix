import { ErrorOutput, GridSettings } from "../../pkg/wasm/core_engine";

export interface AppState {
  output_type: OutputType,
  language: Language,
  hot_reload: boolean,
}

export const OutputType = {
  GRID: "grid",
} as const;
export type OutputType = typeof OutputType[keyof typeof OutputType];

export const Language = {
  RHAI: "rhai",
} as const;
export type Language = typeof Language[keyof typeof Language];

export interface Output {
  pipeline(script: string): Promise<ErrorOutput | null>,
  init(): void,
  deinit(): void,
};

export interface WorkerMessage {
  script: string,
  state: AppState,
  config: GridSettings, // Add new settings here
};

export class ScriptError {
  text?: string;
  position?: [number, number] | null; // line, char
}
