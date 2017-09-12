import rafScheduler from 'raf-schd';

function createImageSlider(parent, transitionDelay = 1000) {
  return img => {
    const existingImg = parent.firstChild;

    const enterImages = rafScheduler(() => {
      if (existingImg) existingImg.classList.add('img-leave');
      img.classList.add('img-enter');
      parent.appendChild(img);
    });

    const leaveImages = rafScheduler(() => {
      if (existingImg) {
        existingImg.classList.remove('img-leave');
        existingImg.remove();
      }

      img.classList.remove('img-enter');
    });

    enterImages();

    const timeout = window.setTimeout(leaveImages, transitionDelay);
    return () => {
      window.clearTimeout(timeout);
      leaveImages();
    }
  };
}

export default createImageSlider;
