import filter from 'ramda/src/filter';
import rafScheduler from 'raf-schd';
import delay from './delay';
import { imgClass } from '../config';

function createImageSlider(parent, transitionDelay = 0) {
  return async blobUrl => {
    const existingImg = parent.firstChild;
    const children = Array.from(parent.children);
    const nextImg = document.createElement('img');
    nextImg.classList.add(imgClass);
    nextImg.setAttribute('src', blobUrl);

    if (transitionDelay === 0 && existingImg) existingImg.replaceWith(nextImg);

    const enterImages = rafScheduler(() => {
      children.forEach(child => {
        child.classList.remove(`${imgClass}-enter`);
        child.classList.add(`${imgClass}-leave`);
      });

      nextImg.classList.add(`${imgClass}-enter`);
      parent.appendChild(nextImg);
    });

    const leaveImages = rafScheduler(() => {
      children.forEach(child => {
        child.classList.remove(`${imgClass}-leave`);
        child.remove();
      });
      nextImg.classList.remove(`${imgClass}-enter`);
    });

    enterImages();
    return delay(leaveImages, transitionDelay);
  };
}

export default createImageSlider;
