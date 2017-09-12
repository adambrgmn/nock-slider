# nock-slider

> A very simple image slider

## Installation

With npm/yarn:

```bash
$ npm install nock-slider
$ yarn add nock-slider
```

Or via `<script>`-tag:

```html
<script src="https://unpkg.com/nock-slider/dist/nock-slider.min.js" type="text/javascript">
<!-- This sets "nockSlider" as a global variable -->
```

## Usage

`nock-slider` actually requires just two things - a DOM-element and an array of images. How you provide them is up to you. But a few options can also be provided. Below you’ll find a few examples.

### Basic setup

In `index.html`:

```html
<body>
  <div id="slideshow"></div>
  <button id="slide-prev">Previous image</button>
  <button id="slide-next">Next image</button>

  <script src="https://unpkg.com/nock-slider/dist/nock-slider.min.js" type="text/javascript">
  <script type="text/javascript">
    var images = ['/image-1.jpg', '/image-2.jpg', '/image-3.jpg'];
    var slideContainer = document.getElementById('slideContainer');
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

  <script src="/assets/js/app.js" type="text/javascript">
</body>
```

In `app.js`:

```js
import nockSlider from 'nock-slider';
import api from './api'; // your own implementation

async function init() {
  const slideContainer = document.getElementById('slideContainer');
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

Once a user clicks any of the buttons this will happen in sequence:

1. `nockSlider` preloads the next or previous image (caching it in memory for next time) :arrow_down:
2. The new image gets appended to the slider inner container (`.slideshow-innerContainer`) :arrow_down:
3. The new image gets the class `.img-enter`, the old image is still existing and gets the class `.img-leave` :arrow_down:
4. 500 ms (note `opts.transitionDuration`) later the old image gets removed from from the DOM and :arrow_down:
5. The `.img-enter`-class gets removed from the new image :checkered_flag:


## API

### `nockSlider`

This is the default, and only, export from the `nock-slider`-library, and also the global variable set if you use html-script-import.

#### Usage

```js
import nockSlider from 'nock-slider';
nockSlider(sliderContaner: DOMElement, images: Array<string>, options?: Object);
```

#### Argument

| Name | Required | Type | Example |
|:-----|:---------|:-----|:--------|
| `sliderContainer` | :heavy_check_mark: | `DOMElement` | `document.getElementById('slide')` |
| `images` | :heavy_check_mark: | `Array` of `string` | `['img-1.jpg', 'img-2.jpg']` |
| `options` | | `Object` (see below) | |

**Options:**

| Name | Type | Default | Example |
|:-----|:-----|:--------|:--------|
| `btnPrevious` | `DOMElement` | `null` | `document.getElementById('btn-previous')` |
| `btnNext` | `DOMElement` | `null` | `document.getElementById('btn-next')` |
| `transitionDuration` | `number` | `0` | `500` |
| `onSlideStart` | `function` | `null` | `src => console.log(src)` |
| `onSlideEnd` | `function` | `null` | `src => console.log(src)` |
| `onSlideError` | `function` | `null` | `src => console.error(src)` |

### `nockSlider`-instance

When `nockSlider` is called it returns an "instance" of the slider with som methods to control the slider. The following methods are available.

| Method | Description | Arguments | Returns | Example |
|:-------|:------------|:----------|:--------|:--------|
| `addImage` | Will add a new image to the end of the queue | `src: string` | `void` | `mySlider.addImage('/newImage.jpg')` |
| `currentImage` | Will get the src of the current image | `-` | `string` | `const currentImage = mySlider.currentImage()` |
| `removeImage` | Will remove the images matching the provided src string | `src: string` | `void` | `mySlider.removeImage('/newImage.jpg')` |