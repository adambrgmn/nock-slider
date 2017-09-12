import head from 'ramda/src/head';
import tail from 'ramda/src/tail';
import last from 'ramda/src/last';
import init from 'ramda/src/init';
import append from 'ramda/src/append';
import filter from 'ramda/src/filter';

function createIterator(arr) {
  let array = arr;
  let current = null;

  return {
    all() {
      return [current, ...array];
    },
    next() {
      const headEl = head(array);
      const restEl = tail(array);
      array = current ? [...restEl, current] : restEl;
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
    add(el) {
      array = append(el, array);
    },
    remove(el) {
      array = filter(e => e !== el, array);
      current = current === el ? null : current;
    },
  };
}

export default createIterator;
