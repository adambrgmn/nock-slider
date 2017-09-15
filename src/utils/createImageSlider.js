import rafScheduler from 'raf-schd';
import { filter, forEach } from './fp';
import delay from './delay';
import { imgClass } from '../config';
import {
  createElement,
  setAttribute,
  addClass,
  appendChild,
  removeClass,
  removeElement,
} from './dom';

function createImageSlider(parent, transitionDelay = 0) {
  return blobUrl => {
    const existingImg = parent.firstChild;
    const children = Array.from(parent.children);
    const nextImg = createElement('img', [imgClass]);
    setAttribute(nextImg, 'src', blobUrl);

    if (transitionDelay === 0 && existingImg) existingImg.replaceWith(nextImg);

    const enterImages = rafScheduler(() => {
      forEach(child => {
        removeClass(child, `${imgClass}-enter`);
        addClass(child, `${imgClass}-leave`);
      }, children);

      addClass(nextImg, `${imgClass}-enter`);
      appendChild(parent, nextImg);
    });

    const leaveImages = rafScheduler(() => {
      forEach(child => {
        removeClass(child, `${imgClass}-leave`);
        removeElement(child);
      }, children);

      removeClass(nextImg, `${imgClass}-enter`);
    });

    enterImages();
    return delay(() => {
      leaveImages();
      return nextImg;
    }, transitionDelay);
  };
}

export default createImageSlider;
