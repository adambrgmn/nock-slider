async function preloadImg(src) {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const img = document.createElement('img');
    img.setAttribute('src', blobUrl);
    img.classList.add('nock-img');

    return img;
  } catch (e) {
    throw src;
  }
}

export default preloadImg;
