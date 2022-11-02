import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';
import sizeOf from 'image-size';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function globAsync(g, options) {
  return new Promise((resolve, reject) => {
    const cb = (err, matches) => {
      if(!!err) {
        reject(err);
      }
      resolve(matches)
    };
    glob(g, options, cb);
  });
}

async function getBestTimeSeries(req, res) {
  const scanFolderRegex = /.*best\/([0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}-[0-9]{2})\//;
  const mapFiles = await globAsync(
    `**/_Phi8_small.png`,
    {root: 'images/ca/best/'}
  );
  const scanFolders = mapFiles
  .map(f => f.match(scanFolderRegex)[1])
  .sort();
  const imagePath = path.join(
    __dirname, 
    '../',
    'images', 
    'ca', 
    'best', 
    scanFolders[0],
    '_Phi8_small.png'
  );
  const { width, height } = sizeOf(imagePath);

  res.json({
    scanFolders,
    width,
    height
  })
}


export default getBestTimeSeries