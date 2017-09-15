function preloadImg(src) {
  return fetch(src)
    .then(res => {
      if (res.status < 200 || res.status > 299) {
        const error = new Error(res.statusText);
        error.src = src;
        error.code = res.status;
        throw error;
      }

      return res.blob();
    })
    .then(blob => URL.createObjectURL(blob));
}

export default preloadImg;
