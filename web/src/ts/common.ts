import { ErrorOutput } from "../../pkg/wasm/core_engine";

export const throttle = (fn: Function, delay: number) => {
  let isThr = false;

  return function (this: any, ...args: any): void {
    if (!isThr) {
      fn.apply(this, args);
      isThr = true;

      setTimeout(() => {
        isThr = false;
      }, delay);
    }
  }
}

export interface Output {
  pipeline(script: string): ErrorOutput | null,
  init(): void,
  deinit(): void,
};

export const html = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || '');
  }, '');
};

export const get_element = <T extends HTMLElement = HTMLElement>(query: string): T => {
  const element = document.querySelector<T>(query);
  if (!element) {
    throw new Error(`Unable to find element from '${query}'`);
  }
  return element;
}
