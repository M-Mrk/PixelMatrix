export const throttle = (fn, delay) => {
  let isThr = false;

  return function(...args) {
    if (!isThr) {
      fn.apply(this, args);
      isThr = true;

      setTimeout(() => {
        isThr = false;
      }, delay);
    }
  }
}
