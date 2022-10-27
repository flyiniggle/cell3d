import renderTimeSeries, { 
  cancelAnimation,
  set,
  start,
  stop,
 } from '/app/lib/renderTimeSeries.js'


const C3D = (function() {
  const well = 'C4';
  const segment = '00_00';

  const loadTimeSeries = async function(progressBar) {
    showLoader();
    const viewer = document.getElementById('timeSeriesViewer');
    const scanPath = `${well}/${segment}`;
    const response = await fetch(`resources/timeseries/${well}/${segment}`);
    const specs = await response.json();
    const frameCount = specs.scanFolders.length;
    
    progressBar.max = frameCount - 1;
    progressBar.addEventListener('input', (e) => {
      set(e.target.value) 
    });

    const resize = await renderTimeSeries(viewer, scanPath, specs, progressBar);
    showTimeSeries();
    resize();
  }

  const showLoader = function() {
    cancelAnimation();
    document.getElementById('loader').style.display = 'revert';
    document.getElementById('controls').style.display = 'none';
    document.querySelectorAll('.viewer').forEach(e => {
      e.classList.remove('loaded');
      e.querySelector('canvas')?.remove();
    });
  };

  const showTimeSeries = function() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('controls').style.display = 'revert';
    document.querySelectorAll('.viewer').forEach(e => e.classList.remove('loaded'));
    document.getElementById('timeSeriesViewer').classList.add('loaded');
  };

  const play = function(event) {
    if(!!event) {
      if(event.target.classList.contains('selected')) return;

      toggleButtons(event);
    }

    start();
  }

  const pause = function(event) {
    if(!!event) {
      if(event.target.classList.contains('selected')) return;
      
      toggleButtons(event);
    }

    stop();
  }

  const toggleButtons = (event) => {
    if(event.target.classList.contains('selected')) return; 

    document.querySelectorAll('.buttons > Button').forEach(b => {
      b.classList.remove('selected');
    });
    event.target.classList.add('selected');
  };

  return {
    loadTimeSeries,
    showLoader,
    showTimeSeries,
    play,
    pause,
  }
})();


export default async function main() {

  document.querySelectorAll('.buttons > Button').forEach(b => {
    const handler = b.dataset.target === 'play' ? C3D.play : C3D.pause;

    b.addEventListener('click', handler);
  });

  const progressBar = document.getElementById('progress');

  C3D.showLoader();
  C3D.loadTimeSeries(progressBar);
}