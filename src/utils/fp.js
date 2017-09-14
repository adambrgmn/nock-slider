export const head = arr => arr[0];
export const last = arr => arr[arr.length - 1];
export const init = arr => arr.slice(0, -1);
export const tail = arr => arr.slice(1);

export const reduce = (fn, init, arr) => {
  let acc = init;
  for (let i = 0; i < arr.length; i++) acc = fn(acc, arr[i]);
  return acc;
};

export const filter = (predicate, arr) =>
  reduce((acc, x) => (predicate(x) ? acc.concat(x) : acc), [], arr);

export const forEach = (fn, arr) => {
  for (let i = 0; i < arr.length; i++) fn(arr[i]);
};

export const prop = (prop, obj) => obj[prop];

export const assoc = (prop, val, obj) => {
  const result = {};
  for (let p in obj) result[p] = obj[p];
  result[prop] = val;
  return result;
};

export const pipe = (...fns) => arg => reduce((acc, fn) => fn(acc), arg, fns);

export const pipeP = (...fns) => {
  const init = x => Promise.resolve(x);
  return reduce((acc, fn) => x => acc(x).then(fn), init, fns);
};

export const isNil = x => x == null;
export const isFunction = fn => fn && typeof fn === 'function';
export const isProd = () => process.env.NODE_ENV === 'production';
