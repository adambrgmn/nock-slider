import pipeP from 'ramda/src/pipeP';
import pipe from 'ramda/src/pipe';
import isNil from 'ramda/src/isNil';
import isFunction from './utils/isFunction';
import createIterator from './utils/iterator';
import memoize from './utils/memoize';
import preloadImg from './utils/preloadImg';
import createImageSlider from './utils/createImageSlider';
import isProd from './utils/isProd';
import { createElement, appendChild } from './utils/dom';
import { innerContainerClass } from './config';

const loadImg = memoize(preloadImg);
const createInnerContainer = parent => {
  const container = createElement('div', [innerContainerClass]);
  appendChild(parent, container);
  return container;
};

async function nockSlider(
  slideContainer,
  imgs = [],
  {
    btnPrevious,
    btnNext,
    transitionDuration = 0,
    onSlideStart,
    onSlideEnd,
    onSlideError,
  } = {},
) {
  const innerContainer = createInnerContainer(slideContainer);
  const slideTo = createImageSlider(innerContainer, transitionDuration);
  const images = createIterator(imgs);
  const loadAndSlide = pipeP(loadImg, slideTo);

  const initialImageSrc = images.next();
  await loadAndSlide(initialImageSrc);

  const transition = next => async () => {
    const event = next ? 'next' : 'prev';
    const nextImageSrc = images[event]();

    try {
      if (isFunction(onSlideStart)) onSlideStart(nextImageSrc);
      const nextImgEl = await loadAndSlide(nextImageSrc);
      if (isFunction(onSlideEnd)) onSlideEnd(nextImgEl);
    } catch (error) {
      if (isFunction(onSlideError)) onSlideError(error);
      images.remove(nextImageSrc);
      await transition(next)();
    }
  };

  btnPrevious && btnPrevious.addEventListener('click', transition(false));
  btnNext && btnNext.addEventListener('click', transition(true));

  return {
    addImage: images.add,
    removeImage: images.remove,
    currentImage: images.current,
    allImages: images.all,
    previous: transition(false),
    next: transition(true),
  };
}

export default nockSlider;
