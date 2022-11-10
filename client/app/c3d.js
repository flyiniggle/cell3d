import * as SmallTimeSeries from '/app/lib/renderSmallAlignedTimeSeries.js';
import * as FullTimeSeries from '/app/lib/renderFullAlignedTimeSeries.js';


const invokeViewer = new Event('invokeViewer');

const showLoader = function() {
  document.getElementById('loader').style.display = 'revert';
  document.querySelectorAll('.viewer').forEach(e => {
    e.classList.remove('loaded');
    e.querySelector('canvas')?.remove();
  });
};

const loadCloseTimeSeries = async function() {
  const viewer = document.getElementById('timeSeriesViewerSmall');
  const response = await fetch(`resources/timeseries/aligned/small`);
  const specs = await response.json();
  const frameCount = specs.scans.length;
  const { resize, startAnimation } = await SmallTimeSeries.renderTimeSeries(viewer, specs);

  return {
    frameCount,
    resize,
    startAnimation
  }
};

const loadFullTimeSeries = async function() {
  const viewer = document.getElementById('timeSeriesViewerFull');
  const response = await fetch(`resources/timeseries/aligned/full`);
  const specs = await response.json();
  const frameCount = specs.scans.length;
  const { resize, startAnimation } = await FullTimeSeries.renderTimeSeries(viewer, specs);

  return {
    frameCount,
    resize,
    startAnimation
  }
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

const setupContainer = ({ 
  container, 
  controller, 
  frameCount,
  resize,
  startAnimation
}) => {
  const frameControlButtonHandler = getToggleButtonHandler(container.querySelector('.frameControlButtons'));
  const overlayControlButtonHandler = getToggleButtonHandler(container.querySelector('.overlayControlButtons'));
  const frameControlButtons = container.querySelectorAll('.frameControlButtons > Button');
  const overlayControlButtons = container.querySelectorAll('.overlayControlButtons > Button');
  const progressBar = container.querySelector('.progress');

  frameControlButtons.forEach(b => {
    b.addEventListener('click', frameControlButtonHandler);
    b.addEventListener('click', b.dataset.target === 'play' ? controller.play : controller.pause);
  });

  overlayControlButtons.forEach(b => {
    b.addEventListener('click', overlayControlButtonHandler);
    b.addEventListener('click', (e) => {
      controller.changeOverlay(e?.target?.dataset?.target ?? '');
    });
  });
  
  progressBar.max = frameCount - 1;
  progressBar.addEventListener('input', (e) => {
    container.querySelector('[data-target="play"]').classList.remove('selected');
    container.querySelector('[data-target="pause"]').classList.add('selected');
    controller.set(e.target.value);
  });

  window.addEventListener('resize', resize, false);

  container.addEventListener('invokeViewer', () => {
    document.querySelectorAll('.container').forEach(e => e.classList.remove('loaded'));
    document.getElementById('loader').style.display = 'none';
    container.classList.add('loaded');

    startAnimation(progressBar);
    resize();
  });
}


export default async function main() {
  const smallContainer = document.getElementById('smallContainer');
  const fullContainer = document.getElementById('fullContainer');

  showLoader();

  loadCloseTimeSeries().then(r => {
    setupContainer({
      container: smallContainer, 
      controller: SmallTimeSeries,
      ...r
    });
    smallContainer.dispatchEvent(invokeViewer);
  });

  loadFullTimeSeries().then(r => {
    setupContainer({
      container: fullContainer, 
      controller: FullTimeSeries,
      ...r
    });
  });
}