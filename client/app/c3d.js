import renderFullImage, { cancelAnimation as cancelFullImage } from '/app/lib/renderFullImage.js'
import renderTimeSeries, { cancelAnimation as cancelTimeSeries } from '/app/lib/renderTimeSeries.js'


const C3D = (function() {
  const well = 'C3';
  const segment = '00_00';

  const loadStatic = async function() {
    showLoader();
    const viewer = document.getElementById('staticViewer');
    const scanPath = `2022-09-21_16-24-57/${well}/${segment}`;
    const response = await fetch(`resources/zmap/${scanPath}`);
    const imageSpecs = await response.json();

    showStatic();
    renderFullImage(viewer, scanPath, imageSpecs);
  };

  const loadTimeSeries = async function() {
    showLoader();
    const viewer = document.getElementById('timeSeriesViewer');
    const scanPath = `${well}/${segment}`;
    const response = await fetch(`resources/timeseries/${well}/${segment}`);
    const specs = await response.json();

    showTimeSeries();
    renderTimeSeries(viewer, scanPath, specs);
  }

  const showLoader = function() {
    cancelFullImage();
    cancelTimeSeries();
    document.getElementById('loader').style.display = 'revert';
    document.getElementById('toolbar').style.display = 'none';
    document.querySelectorAll('.viewer').forEach(e => {
      e.classList.remove('loaded');
      e.querySelector('canvas')?.remove();
    });
  };

  const showStatic = function() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('toolbar').style.display = 'revert';
    document.querySelectorAll('.viewer').forEach(e => e.classList.remove('loaded'));
    document.getElementById('staticViewer').classList.add('loaded');
  };

  const showTimeSeries = function() {
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

  return {
    loadStatic,
    loadTimeSeries,
    showLoader,
    showStatic,
    renderTimeseries: showTimeSeries,
    toggleButtons,
  }
})();


export default async function main() {
  C3D.showLoader();
  C3D.loadStatic();

  document.querySelectorAll('.toolbar > Button').forEach(b => {
    b.addEventListener('click', C3D.toggleButtons);
  });
}