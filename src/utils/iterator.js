import { head, tail, last, init, filter, isNil } from './fp';

function createIterator(arr) {
  let array = arr;
  let current = null;

  return {
    next() {
      const headEl = head(array);
      const restEl = tail(array);
      array = !isNil(current) ? [...restEl, current] : restEl;
      current = headEl;
      return headEl;
    },
    prev() {
      const lastEl = last(array);
      const restEl = init(array);
      array = current ? [current, ...restEl] : restEl;
      current = lastEl;
      return lastEl;
    },
    all() {
      return [current, ...array];
    },
    current() {
      return current;
    },
    add(el) {
      array = [...array, el];
    },
    remove(el) {
      array = filter(e => e !== el, array);
      current = current === el ? null : current;
    },
  };
}

export default createIterator;
