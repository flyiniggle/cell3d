import * as THREE from '/external/three/build/three.module.js'
import { OrbitControls } from '/app/components/OrbitControls.js';
import Clock from '/app/lib/clock.js';
import loadTexture from '/app/lib/loadTexture.js';


let progressBar;
let animationID;
let clock;
let overlay = 'color';
let loadState = false;
let closeMaps = [];
let colorMaterials = [];
let bestMaterials = [];
let contourMaterials = [];
let phi8Materials = [];

export async function renderTimeSeries(viewer, specs) {
  const {
    scans,
    width,
    height,
  } = specs;
  const scene = new THREE.Scene();
  
  clock = new Clock(scans.length, .25);

  if(loadState === false) {
    // Array<[base overlay, best overlay, contours overlay, displacementMap]>
    closeMaps = await Promise.all(scans.map(scan => {
      return Promise.all([
        loadTexture(`aligned/small/phi8/${scan}_Phi8.png`),
        loadTexture(`aligned/small/best_flatten/${scan}_best.png`),
        loadTexture(`aligned/small/cell_overlay/${scan}_Phi8.png`),
        loadTexture(`aligned/small/phi8color/${scan}_Phi8Color.png`),
      ]);
    }));

    loadState = true;
  }
  
  colorMaterials = closeMaps.map(([displacementMap, , , map]) => new THREE.MeshLambertMaterial({ 
    map,
    displacementMap,
    displacementScale: 10
  }));

  bestMaterials = closeMaps.map(([displacementMap, map]) => new THREE.MeshLambertMaterial({ 
    map,
    displacementMap,
    displacementScale: 10
  }));
  
  contourMaterials = closeMaps.map(([displacementMap, , map]) => new THREE.MeshLambertMaterial({ 
    map,
    displacementMap,
    displacementScale: 10
  }));
  
  phi8Materials = closeMaps.map(([displacementMap]) => new THREE.MeshLambertMaterial({ 
    map: displacementMap,
    displacementMap,
    displacementScale: 10
  }));

  const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);

  const mesh = new THREE.Mesh(geometry, colorMaterials[0]);
  scene.add(mesh);

  const light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x37474F );
  renderer.setSize(viewer.offsetWidth, viewer.offsetHeight);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 5000);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = (Math.PI / 2);
  controls.maxPolarAngle = Math.PI - .05;
  controls.minAzimuthAngle = (Math.PI * -.25);
  controls.maxAzimuthAngle = (Math.PI / 4);
  controls.minZPan = 0;
  controls.maxZPan = 100;

  function animate() {
    animationID = window.requestAnimationFrame(animate);
    
    let materials = colorMaterials;
    switch(overlay) {
      case 'best':
        materials = bestMaterials;
        break;
      case 'color':
        materials = colorMaterials;
        break;
      case 'contour':
        materials = contourMaterials;
        break;
      case 'phi8':
        materials = phi8Materials;
        break;
      default:
        materials = colorMaterials;
    }
    const frame = clock.getFrame();
    const progress = clock.getProgress();

    progressBar.value = progress;
    progressBar.style.backgroundSize = (progress - progressBar.min) * 100 / (progressBar.max - progressBar.min) + '% 100%';

    mesh.material = materials[frame];
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render( scene, camera );
  }

  function startAnimation(p) {
    progressBar = p;
    animate();
  }

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function render() {
    viewer.appendChild(renderer.domElement);
    camera.position.x = 0;
    camera.position.y = -250;
    camera.position.z = 200;
    clock.setFrame(0);
  }

  function tearDown() {
    if(animationID) window.cancelAnimationFrame(animationID);
    viewer.removeChild(renderer.domElement);
    clock.stop();
  }

  return {
    render,
    resize,
    startAnimation,
    tearDown,
  }
}

export const cancelAnimation = () => {
  if(animationID) window.cancelAnimationFrame(animationID);
};

export const play = () => clock.start();

export const pause = () => clock.stop();

export const set = (frame) => {
  clock.stop();
  clock.setFrame(frame);
}

export const changeOverlay = o => {
  if(!['best', 'color', 'contour', 'phi8'].includes(o)) {
    throw new TypeError(`${o} is not an option`);
  }

  overlay = o
}

export const getLoadState = () => loadState;