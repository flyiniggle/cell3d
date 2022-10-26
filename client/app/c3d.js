import renderTimeSeries, { 
  cancelAnimation,
  start,
  stop
 } from '/app/lib/renderTimeSeries.js'


const C3D = (function() {
  const well = 'C4';
  const segment = '00_00';

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
    cancelAnimation();
    document.getElementById('loader').style.display = 'revert';
    document.getElementById('toolbar').style.display = 'none';
    document.querySelectorAll('.viewer').forEach(e => {
      e.classList.remove('loaded');
      e.querySelector('canvas')?.remove();
    });
  };

  const showTimeSeries = function() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('toolbar').style.display = 'revert';
    document.querySelectorAll('.viewer').forEach(e => e.classList.remove('loaded'));
    document.getElementById('timeSeriesViewer').classList.add('loaded');
  };

  const togglePlay = (event) => {
    if(event.target.classList.contains('selected')) return; 

    document.querySelectorAll('.toolbar > Button').forEach(b => {
      b.classList.remove('selected');
    });
    event.target.classList.add('selected');

    const t = event.target.dataset.target;
    
    switch(t) {
      case 'play': {
        start();
        break;
      }
      case 'pause': {
        stop();
        break;
      }
      default: {
        () => undefined;
      }
    }
  };

  return {
    loadTimeSeries,
    showLoader,
    showTimeSeries,
    togglePlay,
  }
})();


export default async function main() {
  C3D.showLoader();
  C3D.loadTimeSeries();

  document.querySelectorAll('.toolbar > Button').forEach(b => {
    b.addEventListener('click', C3D.togglePlay);
  });
}