import getPixelsLib from 'get-pixels';


async function getPixels(imgPath) {
  return new Promise((resolve, reject) => {
    getPixelsLib(imgPath, (error, pixels) => {
      if(!!error) {
        reject(error)
      }
      resolve(pixels)
    })
  });
}


export default getPixels