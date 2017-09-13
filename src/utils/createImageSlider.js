import filter from 'ramda/src/filter';
import rafScheduler from 'raf-schd';
import delay from './delay';

const BASE_CLASS = 'nock-img';

function createImageSlider(parent, transitionDelay = 0) {
  return async img => {
    const existingImg = parent.firstChild;
    const children = Array.from(parent.children);

    if (transitionDelay === 0 && existingImg) existingImg.replaceWith(img);

    const enterImages = rafScheduler(() => {
      children.forEach(child => {
        child.classList.remove(`${BASE_CLASS}-enter`);
        child.classList.add(`${BASE_CLASS}-leave`);
      });

      img.classList.add(`${BASE_CLASS}-enter`);
      parent.appendChild(img);
    });

    const leaveImages = rafScheduler(() => {
      children.forEach(child => {
        child.classList.remove(`${BASE_CLASS}-leave`);
        child.remove();
      });
      img.classList.remove(`${BASE_CLASS}-enter`);
    });

    enterImages();
    return delay(leaveImages, transitionDelay);
  };
}

export default createImageSlider;
