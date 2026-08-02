export const throttle = (fn, delay) => {
  let isThr = false;

  return function (...args) {
    if (!isThr) {
      fn.apply(this, args);
      isThr = true;

      setTimeout(() => {
        isThr = false;
      }, delay);
    }
  }
}

/**
 * @typedef {Object} Output
 * @property {function(String, AppState): void} pipeline - runs the script and draws to the canvas
 * @property {function(): void} init - Changes the UI and loads settings
 * @property {function(): void} update_settings - Updates internal settings from UI
 */

/**
 * @type {Output}
 */
export const Output = {
  pipeline: (script, state) => { },
  init: () => { },
  update_settings: () => { },
};

export const html = (strings, ...values) => {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || '');
  }, '');
};
