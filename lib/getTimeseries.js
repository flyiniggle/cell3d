import { readdir } from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function getTimeSeries(req, res) {
  const { well, segment } = req.params;
  const scanDirs = await readdir(path.join(__dirname, '..', 'images', 'results', 'derived'))

  console.log(scanDirs);

  res.json([])
}


export default getTimeSeries