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

export const spinner_html = html`
<div class="spinner"></div>
`;
