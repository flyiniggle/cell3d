import renderFullImage from '/app/lib/renderFullImage.js'


export const loadImage = async () => {
  const response = await fetch('resources/zmap');
  const imageData = await response.json();

  return imageData
}

export default async function main(viewer) {
  const imageSpecs = await loadImage();

  document.getElementById('loader').style.display = 'none';
  viewer.style.display = 'block';
  renderFullImage(viewer, imageSpecs);

  
}