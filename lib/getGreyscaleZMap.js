import getPixelRGBAData from "./getPixelRGBAData.js";
import getPixels from "./getPixels.js";

async function getGreyscaleZMap(imgPath) {
  const pixels = await getPixels(imgPath);
  const rgbas = getPixelRGBAData(pixels)

  return {
    width: pixels.shape[0],
    height: pixels.shape[1],
    zMap: rgbas
  }
}

export default getGreyscaleZMap