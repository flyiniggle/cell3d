import { TextureLoader } from '/external/three/build/three.module.js';


async function loadTexture(url) {
  return new Promise((resolve, reject) => {
    new TextureLoader().load(
      url, 
      resolve,
      () => undefined,
      reject
    );
  });
}


export default loadTexture;