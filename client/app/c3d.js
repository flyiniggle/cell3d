import renderTimeSeries, { 
  cancelAnimation,
  set,
  play,
  pause,
  showBest,
  showColor
 } from '/app/lib/renderTimeSeries.js'


const C3D = (function() {

  const showLoader = function() {
    cancelAnimation();
    document.getElementById('loader').style.display = 'revert';
    document.querySelectorAll('.controls').forEach(e => e.style.display = 'none');
    document.querySelectorAll('.viewer').forEach(e => {
      e.classList.remove('loaded');
      e.querySelector('canvas')?.remove();
    });
  };

  const loadTimeSeries = async function(progressBar) {
    showLoader();
    const viewer = document.getElementById('timeSeriesViewer');
    const response = await fetch(`resources/timeseries/best`);
    const specs = await response.json();
    const frameCount = specs.scanFolders.length;
    
    progressBar.max = frameCount - 1;
    progressBar.addEventListener('input', (e) => {
      document.querySelector('[data-target="play"]').classList.remove('selected');
      document.querySelector('[data-target="pause"]').classList.add('selected');
      set(e.target.value);
    });

    const { resize, startAnimation } = await renderTimeSeries(viewer, specs);

    window.addEventListener('resize', resize, false);
    startAnimation(progressBar);
    showTimeSeries();
    resize();
  };

  const showTimeSeries = function() {
    document.getElementById('loader').style.display = 'none';
    document.querySelectorAll('.controls').forEach(e => e.style.display = 'flex');
    document.querySelectorAll('.viewer').forEach(e => e.classList.remove('loaded'));
    document.getElementById('timeSeriesViewer').classList.add('loaded');
  };

  const getToggleButtonHandler = (container) => {
    return (event) => {
      if(event.target.classList.contains('selected')) return; 

      container.querySelectorAll('Button').forEach(b => {
        b.classList.remove('selected');
      });
      event.target.classList.add('selected');
    };
  }

  return {
    getToggleButtonHandler,
    loadTimeSeries,
    showLoader,
    showTimeSeries
  }
})();


export default async function main() {
  const frameControlButtonHandler = C3D.getToggleButtonHandler(document.querySelector('.frameControlButtons'));
  const overlayControlButtonHandler = C3D.getToggleButtonHandler(document.querySelector('.overlayControlButtons'));
  const frameControlButtons = document.querySelectorAll('.frameControlButtons > Button');
  const overlayControlButtons = document.querySelectorAll('.overlayControlButtons > Button');

  frameControlButtons.forEach(b => {
    b.addEventListener('click', frameControlButtonHandler);
    b.addEventListener('click', b.dataset.target === 'play' ? play : pause);
  });
  overlayControlButtons.forEach(b => {
    b.addEventListener('click', overlayControlButtonHandler);
    b.addEventListener('click', b.dataset.target === 'color' ? showColor : showBest);
  });

  const progressBar = document.getElementById('progress');

  C3D.showLoader();
  C3D.loadTimeSeries(progressBar);
}