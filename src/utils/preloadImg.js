async function preloadImg(src) {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  } catch (e) {
    throw src;
  }
}

export default preloadImg;
