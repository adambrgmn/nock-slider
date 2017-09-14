import { isFunction } from './fp';

export default function(fn, ...args) {
  if (isFunction(fn)) return fn(...args);
  return null;
}
