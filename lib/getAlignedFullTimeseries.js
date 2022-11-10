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

async function getAlignedFullTimeSeries(req, res) {
  const scanTimeRegex = /.*phi8\/([0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}-[0-9]{2})/;
  const mapFiles = await globAsync(
    `/*.png`,
    {root: 'images/ca/aligned/full/phi8/'}
  );
  const scans = mapFiles
  .map(f => f.match(scanTimeRegex)[1])
  .sort();
  const imagePath = path.join(
    __dirname, 
    '../',
    'images', 
    'ca', 
    'aligned', 
    'full',
    'phi8',
    `${scans[0]}_Phi8.png`
  );
  const { width, height } = sizeOf(imagePath);

  res.json({
    scans,
    width,
    height
  })
}


export default getAlignedFullTimeSeries