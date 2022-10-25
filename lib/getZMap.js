import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import getGreyscaleZMap from './getGreyscaleZMap.js';


const __dirname = dirname(fileURLToPath(import.meta.url));

async function getZMap(req, res) {
  const scanPath = req.params[0];
  const imagePath = path.join(
    __dirname, 
    '../',
    'images', 
    'results', 
    'derived', 
    scanPath, 
    '_Phi8.png'
  );
  const imageData = await getGreyscaleZMap(imagePath);

  res.json(imageData)
}


export default getZMap;