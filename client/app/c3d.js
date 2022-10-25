import renderFullImage from '/app/lib/renderFullImage.js'


const loadImage = async (path) => {
  const response = await fetch(`resources/zmap/${path}`);
  const imageData = await response.json();

  return imageData
};

const toggleButtons = (event) => {
  document.querySelectorAll('.toolbar > Button').forEach(b => {
    b.classList.remove('selected');
  });
  event.target.classList.add('selected')
};

export default async function main(viewer) {
  const scanPath = '2022-09-21_16-24-57/A1/00_00';
  const imageSpecs = await loadImage(scanPath);

  document.querySelectorAll('.toolbar > Button').forEach(b => {
    b.addEventListener('click', toggleButtons);
  });

  document.getElementById('loader').style.display = 'none';
  viewer.classList.add('loaded');
  renderFullImage(viewer, scanPath, imageSpecs);
}