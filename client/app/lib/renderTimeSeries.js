import * as THREE from '/external/three/build/three.module.js'
import { OrbitControls } from '/app/components/OrbitControls.js';
import Clock from '/app/lib/clock.js';
import loadTexture from '/app/lib/loadTexture.js';


let progressBar;
let animationID;
let clock;

async function renderTimeSeries(viewer, scanPath, specs) {
  const {
    scanFolders,
    width,
    height,
  } = specs;
  const scene = new THREE.Scene();
  
  clock = new Clock(scanFolders.length, .5);

  // Array<[nomralMap, displacementMap]>
  const maps = await Promise.all(scanFolders.map(dir => {
    return Promise.all([
      loadTexture(`ca/${dir}/${scanPath}/_Phi8Color.png`),
      loadTexture(`ca/${dir}/${scanPath}/_Phi8.png`)
    ]);
  }));
  
  const materials = maps.map(([normalMap, displacementMap]) => new THREE.MeshNormalMaterial({ 
    normalMap,
    displacementMap,
    displacementScale: 20
  }));

  const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);

  const mesh = new THREE.Mesh(geometry, materials[0]);
  scene.add(mesh);

  const light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x37474F );
  renderer.setSize(viewer.offsetWidth, viewer.offsetHeight);
  viewer.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 5000);
  camera.position.x = 0;
  camera.position.y = -1000;
  camera.position.z = 2000;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = (Math.PI / 2);
  controls.maxPolarAngle = Math.PI - .05;
  controls.minAzimuthAngle = (Math.PI * -.25);
  controls.maxAzimuthAngle = (Math.PI / 4);
  controls.minZPan = 0;
  controls.maxZPan = 2500;

  function animate() {
    animationID = window.requestAnimationFrame(animate);

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

export const stop = () => clock.stop();

export const start = () => clock.start();

export const set = (frame) => {
  clock.stop();
  clock.setFrame(frame);
}

export default renderTimeSeries