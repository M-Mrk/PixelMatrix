export const throttle = (fn: Function, delay: number) => {
  let isThr = false;

  return function(this: any, ...args: any): void {
    if (!isThr) {
      fn.apply(this, args);
      isThr = true;

      setTimeout(() => {
        isThr = false;
      }, delay);
    }
  }
}

export const debounce = (fn: Function, delay: number) => {
  let timer_id: number;
  return function(this: any, ...args: any): void {
    if (timer_id) {
      clearTimeout(timer_id);
    }

    timer_id = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }
}

export const html = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings
    .reduce((result, string, i) => {
      return result + string + (values[i] || '');
    }, '')
    .replace(/\s*\n\s*/g, '');
};

export const get_element = <T extends HTMLElement = HTMLElement>(query: string): T => {
  const element = document.querySelector<T>(query);
  if (!element) {
    throw new Error(`Unable to find element from '${query}'`);
  }
  return element;
}
