import * as THREE from '/external/three/build/three.module.js'
import { OrbitControls } from '/app/components/OrbitControls.js';
import Clock from '/app/lib/clock.js';
import loadTexture from '/app/lib/loadTexture.js';


let progressBar;
let animationID;
let clock;
let overlay = 'color';

async function renderTimeSeries(viewer, specs) {
  const {
    scanFolders,
    width,
    height,
  } = specs;
  const scene = new THREE.Scene();
  
  clock = new Clock(scanFolders.length, .25);

  // Array<[normalMap, normalMap, displacementMap]>
  const maps = await Promise.all(scanFolders.map(dir => {
    return Promise.all([
      loadTexture(`best/${dir}/_Phi8Color.png`),
      loadTexture(`best/${dir}/best.png`),
      loadTexture(`best/${dir}/_Phi8.png`),
    ]);
  }));
  
  const colorMaterials = maps.map(([map, , displacementMap]) => new THREE.MeshLambertMaterial({ 
    map,
    displacementMap,
    displacementScale: 10
  }));

  const bestMaterials = maps.map(([ , map, displacementMap]) => new THREE.MeshLambertMaterial({ 
    map,
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
  viewer.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 5000);
  camera.position.x = 0;
  camera.position.y = -250;
  camera.position.z = 500;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = (Math.PI / 2);
  controls.maxPolarAngle = Math.PI - .05;
  controls.minAzimuthAngle = (Math.PI * -.25);
  controls.maxAzimuthAngle = (Math.PI / 4);
  controls.minZPan = 0;
  controls.maxZPan = 100;

  function animate() {
    animationID = window.requestAnimationFrame(animate);

    const materials = overlay === 'best' ? bestMaterials : colorMaterials;
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

  return {
    resize,
    startAnimation,
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

export const showBest = () => {
  overlay = 'best';
}

export const showColor = () => {
  overlay = 'color';
}

export default renderTimeSeries