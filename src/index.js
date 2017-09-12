import pipeP from 'ramda/src/pipeP';
import pipe from 'ramda/src/pipe';
import isNil from 'ramda/src/isNil';
import isFunction from './utils/isFunction';
import createIterator from './utils/iterator';
import memoize from './utils/memoize';
import preloadImg from './utils/preloadImg';
import createImageSlider from './utils/createImageSlider';

const loadImg = memoize(preloadImg);
const createInnerContainer = parent => {
  const container = document.createElement('div');
  container.classList.add('slideshow-innerContainer');
  parent.appendChild(container);
  return container;
};

async function simpleSlider(
  slideContainer,
  imgs = [],
  {
    btnPrevious,
    btnNext,
    onSlideStart,
    onSlideEnd,
    onSlideError,
    transitionDuration = 500,
  } = {},
) {
  const innerContainer = createInnerContainer(slideContainer);
  const slideTo = createImageSlider(innerContainer, transitionDuration);
  const images = createIterator(imgs);
  const loadAndSlide = pipeP(loadImg, slideTo);

  const initialImageSrc = images.next();
  let clearTransition = await loadAndSlide(initialImageSrc);

  const transition = next => async () => {
    const event = next ? 'next' : 'prev';
    if (!isNil(clearTransition)) clearTransition();

    const nextImageSrc = images[event]();
    if (isFunction(onSlideStart)) onSlideStart(nextImageSrc);

    try {
      clearTransition = await loadAndSlide(nextImageSrc);
      if (isFunction(onSlideEnd)) onSlideEnd(nextImageSrc);
    } catch (errorSrc) {
      images.remove(errorSrc);
      if (isFunction(onSlideError)) onSlideError(errorSrc);
      await transition(next)();
    }
  };

  btnPrevious && btnPrevious.addEventListener('click', transition(false));
  btnNext && btnNext.addEventListener('click', transition(true));

  return {
    addImage: src => images.add(src),
    previous: transition(false),
    next: transition(true),
  };
}

export default simpleSlider;
