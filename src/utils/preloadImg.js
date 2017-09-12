function preloadImg(src) {
  const imgEl = document.createElement('img');
  imgEl.setAttribute('src', src);
  imgEl.classList.add('slideshow-img');

  return new Promise((resolve, reject) => {
    imgEl.onload = () => resolve(imgEl);
    imgEl.onerror = () => reject(src);
  });
};

export default preloadImg;
