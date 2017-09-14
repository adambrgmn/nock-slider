import { prop, assoc, isNil, isProd } from './fp';

function memoize(fn) {
  let cache = {};
  const getFromCache = p => prop(p, cache);
  const setInCache = (p, val) => assoc(p, val, cache);

  return async (...args) => {
    let argsString = JSON.stringify(args);
    const resultFromCache = getFromCache(argsString);

    if (isNil(resultFromCache)) {
      !isProd() && console.log('Not found in cache');
      const result = await fn(...args);
      cache = setInCache(argsString, result);
      return result;
    }

    !isProd() && console.log('Found in cache');
    return resultFromCache;
  };
}

export default memoize;
