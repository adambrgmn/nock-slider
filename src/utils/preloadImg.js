async function preloadImg(src) {
  try {
    const res = await fetch(src);

    if (res.status < 200 || res.status > 299) {
      const error = new Error(res.statusText);
      error.src = src;
      error.code = res.status;
      throw error;
    }

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
  } catch (error) {
    throw error;
  }
}

export default preloadImg;
