// worker.js

import { encode } from "blurhash";

// src/worker.js or src/blurhashWorker.worker.js
onmessage = async function (e) {
  const imageUrl = e.data;
  let result;
  try {
    const image = await loadImage(imageUrl);
    const bitmap = await createImageBitmap(image);
    const imageData = await getImageData(bitmap);
    if (imageData) {
      result = encode(imageData.data, imageData.width, imageData.height, 4, 4);
      postMessage(result);
    } else {
      throw new Error("There is no image data");
    }
  } catch (error) {
    postMessage({ error: error.message });
  }
};

async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

async function getImageData(imageBitmap) {
  const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
  const context = canvas.getContext("2d");
  context.drawImage(imageBitmap, 0, 0);
  return context.getImageData(0, 0, imageBitmap.width, imageBitmap.height);
}
