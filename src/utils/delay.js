function delay(fn, duration) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      try {
        const result = fn();

        if (result && typeof result.then === 'function')
          return result.then(resolve).catch(reject);

        return resolve(result);
      } catch (e) {
        return reject(e);
      }
    }, duration);
  });
}

export default delay;
