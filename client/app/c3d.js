import renderFullImage from '/app/lib/renderFullImage.js'


const loadImage = async () => {
  const response = await fetch('resources/zmap');
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
  const imageSpecs = await loadImage();

  document.querySelectorAll('.toolbar > Button').forEach(b => {
    b.addEventListener('click', toggleButtons);
  });

  document.getElementById('loader').style.display = 'none';
  viewer.classList.add('loaded');
  renderFullImage(viewer, imageSpecs);

  
}