import isFunction from './isFunction';

export default function(fn, ...args) {
  if (isFunction(fn)) return fn(...args);
  return null;
}
