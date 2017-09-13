# nock-slider

> A very simple image slider

`nock-slider` is a small image slideshow library with a very basic api. But hopefully the few methods and configurations available will make it powerfull enough.
It's suited for simple image viewing on websitets that value a small footprint regarding javascript-size. `nock-slider` doesn't provide any form of styling at all, it just takes care of loading the next image before it gets placed in the DOM. But together with a few css-classes the slideshow is easily stylable.

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [`nockSlider`](#nockslider)
  - [`nockSlider`-instance](#nockslider-instance)
- [Styling](#styling)
- [Browser support](#browser-support)

## Installation

With npm/yarn:

```bash
npm install nock-slider
# or with yarn
yarn add nock-slider
```

Or via `<script>`-tag:

```html
<script src="https://unpkg.com/nock-slider/dist/nock-slider.min.js" type="text/javascript" />
<!-- This sets "nockSlider" as a global variable -->
```

## Usage

`nock-slider` actually requires just two things - a DOM-element and an array of images. How you provide them is up to you. A few options can also be provided. Below you’ll find a few examples.

### Basic setup

In `index.html`:

```html
<body>
  <div id="slideshow"></div>
  <button id="slide-prev">Previous image</button>
  <button id="slide-next">Next image</button>

  <script src="https://unpkg.com/nock-slider/dist/nock-slider.min.js" type="text/javascript" />
  <script type="text/javascript">
    var images = ['/image-1.jpg', '/image-2.jpg', '/image-3.jpg'];
    var slideContainer = document.getElementById('slideshow');
    var btnPrevious = document.getElementById('slide-prev');
    var btnNext = document.getElementById('slide-next');

    nockSlider(slideContainer, images, { btnPrevious: btnPrevious, btnNext: btnNext });
  </script>
</body>
```

This is the most basic of setups. This will create an inner container inside `#slideshow` and load in the first image (`/image-1.jpg`). Once a user clicks either of the buttons the slider will immediately transition (note that no effects are added to the transition, you'll have to do that yourself) to the next or previous images.


### Advanced setup

In `index.html`:

```html
<body>
  <div id="slideshow"></div>
  <button id="slide-prev">Previous image</button>
  <button id="slide-next">Next image</button>

  <script src="/assets/js/app.js" type="text/javascript" />
</body>
```

In `app.js`:

```js
import nockSlider from 'nock-slider';
import api from './api'; // your own implementation

async function init() {
  const slideContainer = document.getElementById('slideshow');
  const btnPrevious = document.getElementById('slide-prev');
  const btnNext = document.getElementById('slide-next');
  const images = await api.getImages();

  const opts = {
    btnPrevious,
    btnNext,
    transitionDuration: 1000,
  };

  const slider = await nockSlider(slideContainer, images, opts);
}

init();
```

This creates a slightly more advanced slider, even though the possibilities aren’t endless :smirk:.

*Note that you probably need something like [Rollup](https://github.com/rollup/rollup) or [Webpack](https://github.com/webpack/webpack) paired with [Babel](https://github.com/babel/babel) to make this code run in most browsers.*

Once a user clicks any of the buttons this will happen in sequence:

1. `nockSlider` preloads the next or previous image (caching it in memory for next time) :arrow_down:
2. The new image gets appended to the slider inner container (`.nock-inner-container`) :arrow_down:
3. The new image gets the class `.nock-img-enter`, the old image is still existing and gets the class `.nock-img-leave` :arrow_down:
4. 500 ms (note `opts.transitionDuration`) later the old image gets removed from from the DOM and :arrow_down:
5. The `.nock-img-enter`-class gets removed from the new image :checkered_flag:


## API

### `nockSlider`

This is the default, and only, export from the `nock-slider`-library, and also the global variable set if you use html-script-import.

#### Usage

```js
import nockSlider from 'nock-slider';
nockSlider(sliderContainer: DOMElement, images: Array<string>, options?: Object);
```

`nockSlider` is an asynchronous function and returns an "instance" of the created slider – see more on [`nockSlider`-instance](#nockSlider-instance).

#### Arguments

| Name              | Required           | Type                    | Example                                      |
|:------------------|:------------------:|:------------------------|:---------------------------------------------|
| `sliderContainer` | :heavy_check_mark: | `DOMElement`            | `document.getElementById('slideshow')`       |
| `images`          | :heavy_check_mark: | `Array` of `image urls` | `['/assets/img-1.jpg', '/assets/img-2.jpg']` |
| `options`         |                    | `Object` (see below)    | -                                            |

**Options:**

| Name                 | Type         | Default | Example                                   |
|:---------------------|:-------------|:--------|:------------------------------------------|
| `btnPrevious`        | `DOMElement` | `null`  | `document.getElementById('btn-previous')` |
| `btnNext`            | `DOMElement` | `null`  | `document.getElementById('btn-next')`     |
| `transitionDuration` | `number`     | `0`     | `500`                                     |
| `onSlideStart`       | `function`   | `null`  | `src => console.log(src)`                 |
| `onSlideEnd`         | `function`   | `null`  | `src => console.log(src)`                 |
| `onSlideError`       | `function`   | `null`  | `src => console.error(src)`               |

**Events:**

`onSlideStart`, `onSlideEnd` and `onSlideError` are fired, as you already might have guessed, when a slide starts, ends or errors (probably error loading an image).

- `onSlideStart` fires with the source of the image provided as a string.
- `onSlideEnd` fires with the newly placed image provided (useful to change the height of the container...)
- `onSlideError` will be calle e.g. if an image can't be loaded, src of the image provided. But **note** that it will also remove the image from the slider queue automatically and slide to the next or previous image in the queue.

### `nockSlider`-instance

When `nockSlider` is called it asynchronously returns an "instance" of the slider with some methods to control the slider.

```js
// Use `await` if inside a `async` function
const instance = await nockSlider(sliderContainer, images);

// Or regular promise if you like
nockSlider(sliderContainer, images).then(instance => console.log(instance));
```

The following methods are available on the "instance".

| Method         | Description                                  | Arguments     | Returns   | Example                                                    |
|:---------------|:---------------------------------------------|:--------------|:----------|:-----------------------------------------------------------|
| `addImage`     | Will add a new image to the end of the queue | `src: string` | `void`    | `mySlider.addImage('/newImage.jpg')`                       |
| `removeImage`  | Will remove the images matching the src      | `src: string` | `void`    | `mySlider.removeImage('/newImage.jpg')`                    |
| `currentImage` | Will get the src of the current image        |               | `string`  | `const currentImage = mySlider.currentImage()`             |
| `allImages`    | Will return all the srcs of images in queue  |               | `[strin]` | `const allImgs = mySlide.allImages()`                      |
| `previous`     | Move to the previous image in queue          |               | `void`    | `btn.addEventListener('click', () => mySlider.previous())` |
| `next`         | Move to the next image in queue              |               | `void`    | `btn.addEventListener('click', () => mySlider.next())`     |

## Styling

The `nock-slider` doesn't provide any styling at all. The only thing it does is that it takes care of loading images and and put them inside the slider. But when it does so it will provide you with three important css-classes which will aid you in the styling - `.nock-img`, `.nock-img-enter` and `.nock-img-leave`.

Here follows snapshots of how the DOM looks during a transition:

```html
1. Before pressing any button

<div id="slideshow">
  <div class="nock-inner-container">
    <img src="/current-image.jpg" class="nock-img">
  </div>
</div>
```

```html
2. Button pressed (this state last for as long as you have defined options.transitionDuration):

<div id="slideshow">
  <div class="nock-inner-container">
    <img src="/current-image.jpg" class="nock-img nock-img-leave">
    <img src="/next-image.jpg" class="nock-img nock-img-enter">
  </div>
</div>
```

```html
3. Transition ended

<div id="slideshow">
  <div class="nock-inner-container">
    <img src="/next-image.jpg" class="nock-img">
  </div>
</div>
```

These classes provided gives you the ability to create your own transitions using css. See [examples](https://github.com/adambrgmn/simple-slider/tree/master/examples) for styling techniques.

## Browser support

The javascript code of `nock-slider` is compiled using Babel. And it's set to support the last five versions of the major browsers out in the wild.

## License

MIT © [Adam Bergman](https://github.com/adambrgmn)
