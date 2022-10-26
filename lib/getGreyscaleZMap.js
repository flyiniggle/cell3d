//import getPixelRGBAData from "./getPixelRGBAData.js";
import getPixels from "./getPixels.js";

async function getGreyscaleZMap(imgPath) {
  const pixels = await getPixels(imgPath);

  return {
    width: pixels.shape[0],
    height: pixels.shape[1]
  }
}

export default getGreyscaleZMap