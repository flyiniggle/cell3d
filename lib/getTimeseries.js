import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';
import getPixels from './getPixels.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function globAsync(g, options) {
  return new Promise((resolve, reject) => {
    const cb = (err, matches) => {
      if(!!err) {
        reject(err);
      }
      resolve(matches)
    }
    glob(
      g,
      options,
      cb
    )

  })
}

async function getTimeSeries(req, res) {
  const scanFolderRegex = /.*derived\/([0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}-[0-9]{2})\//
  const { well, segment } = req.params;
  const mapFiles = await globAsync(
    `**/${well}/${segment}/_Phi8.png`,
    {root: 'images/results/derived/'}
  );
  const scanFolders = mapFiles
  .map(f => f.match(scanFolderRegex)[1])
  .sort();
  const imagePath = path.join(
    __dirname, 
    '../',
    'images', 
    'results', 
    'derived', 
    scanFolders[0],
    well,
    segment, 
    '_Phi8.png'
  );
  const pixels = await getPixels(imagePath)

  res.json({
    scanFolders,
    width: pixels.shape[0],
    height: pixels.shape[1]
  })
}


export default getTimeSeries