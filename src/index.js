import { pipeP } from './utils/fp';
import createIterator from './utils/iterator';
import memoize from './utils/memoize';
import preloadImg from './utils/preloadImg';
import createImageSlider from './utils/createImageSlider';
import callIfFunction from './utils/callIfFunction';
import { createElement, appendChild, addClass, removeClass } from './utils/dom';
import { innerContainerClass, baseName } from './config';

const loadImg = memoize(preloadImg);
const createInnerContainer = parent => {
  const container = createElement('div', [innerContainerClass]);
  appendChild(parent, container);
  return container;
};

const createContainerState = container => {
  const className = `${baseName}-loading`;
  return {
    isLoading: x => {
      addClass(container, className);
      return x;
    },
    isNotLoading: x => {
      removeClass(container, className);
      return x;
    },
  };
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
  const containerState = createContainerState(slideContainer);
  const slideTo = createImageSlider(innerContainer, transitionDuration);
  const images = createIterator(imgs);

  const loadAndSlide = pipeP(
    src => {
      callIfFunction(onSlideStart, src);
      containerState.isLoading();
      return src;
    },
    loadImg,
    blob => {
      containerState.isNotLoading();
      return blob;
    },
    slideTo,
    imgEl => callIfFunction(onSlideEnd, imgEl),
  );

  const initialImageSrc = images.next();
  await loadAndSlide(initialImageSrc);

  const transition = next => async () => {
    const event = next ? 'next' : 'prev';
    const nextImageSrc = images[event]();

    try {
      await loadAndSlide(nextImageSrc);
    } catch (error) {
      callIfFunction(onSlideError, error);
      containerState.isNotLoading();

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
