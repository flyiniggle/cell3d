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

async function getTimeSeries(req, res) {
  const scanFolderRegex = /.*derived\/([0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}-[0-9]{2})\//;
  const { well, segment } = req.params;
  const mapFiles = await globAsync(
    `**/${well}/${segment}/_Phi8.png`,
    {root: 'images/ca/derived/'}
  );
  const scanFolders = mapFiles
  .map(f => f.match(scanFolderRegex)[1])
  .sort();
  const imagePath = path.join(
    __dirname, 
    '../',
    'images', 
    'ca', 
    'derived', 
    scanFolders[0],
    well,
    segment, 
    '_Phi8.png'
  );
  const { width, height } = sizeOf(imagePath);

  res.json({
    scanFolders,
    width,
    height
  })
}


export default getTimeSeries