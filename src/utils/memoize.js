import prop from 'ramda/src/prop';
import lensProp from 'ramda/src/lensProp';
import set from 'ramda/src/set';
import isNil from 'ramda/src/isNil';
import isProd from './isProd';

function memoize(fn) {
  let cache = {};
  const getFromCache = p => prop(p, cache);
  const setInCache = (p, val) => set(lensProp(p), val, cache);

  return async (...args) => {
    let argsString = JSON.stringify(args);
    const resultFromCache = getFromCache(argsString);

    if (isNil(resultFromCache)) {
      !isProd && console.log('Not found in cache');
      const result = await fn(...args);
      cache = setInCache(argsString, result);
      return result;
    }

    !isProd && console.log('Found in cache');
    return resultFromCache;
  };
}

export default memoize;
