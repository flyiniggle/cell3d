import renderFullImage from '/app/lib/renderFullImage.js'


const well = 'A1';
const segment = '00_00';

const loadStatic = async function() {
  renderLoader();
  const viewer = document.getElementById('staticViewer');
  const scanPath = `2022-09-21_16-24-57/${well}/${segment}`;
  const response = await fetch(`resources/zmap/${scanPath}`);
  const imageSpecs = await response.json();

  renderStatic();
  console.log(scanPath)
  renderFullImage(viewer, scanPath, imageSpecs);
};

const loadTimeSeries = async function() {
  renderLoader();
  const response = await fetch(`resources/timeseries/${well}/${segment}`);
  const timeseries = await response.json();

  renderTimeseries();
  console.log(timeseries)
}

const renderLoader = function() {
  document.getElementById('loader').style.display = 'revert';
  document.getElementById('toolbar').style.display = 'none';
  document.querySelectorAll('.viewer').forEach(e => e.classList.remove('loaded'));
};

const renderStatic = function() {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('toolbar').style.display = 'revert';
  document.querySelectorAll('.viewer').forEach(e => e.classList.remove('loaded'));
  document.getElementById('staticViewer').classList.add('loaded');
};

const renderTimeseries = function() {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('toolbar').style.display = 'revert';
  document.querySelectorAll('.viewer').forEach(e => e.classList.remove('loaded'));
  document.getElementById('timeSeriesViewer').classList.add('loaded');
};

const toggleButtons = (event) => {
  if(event.target.classList.contains('selected')) return; 

  document.querySelectorAll('.toolbar > Button').forEach(b => {
    b.classList.remove('selected');
  });
  event.target.classList.add('selected');

  const t = event.target.dataset.target;
  
  switch(t) {
    case 'static': {
      loadStatic();
      break;
    }
    case 'timeseries': {
      loadTimeSeries();
      break;
    }
    default: {
      () => undefined;
    }
  }

};

export default async function main() {
  renderLoader();
  loadStatic();

  document.querySelectorAll('.toolbar > Button').forEach(b => {
    b.addEventListener('click', toggleButtons);
  });
}