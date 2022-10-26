import * as THREE from '/external/three/build/three.module.js'
import { OrbitControls } from '/app/components/OrbitControls.js';
//import setVertexZPositions from '/app/lib/setVertexZPositions.js';


let animationID;

function renderFullImage(viewer, scanPath, imageSpecs) {
  const {
    width,
    height,
    zMap
  } = imageSpecs
  const scene = new THREE.Scene();
  // const texture = new THREE.TextureLoader().load(`ca/${scanPath}/_Phi8Color.png`);
  // const material = new THREE.MeshPhongMaterial({ map: texture });
  const normalMap = new THREE.TextureLoader().load(`ca/${scanPath}/_Phi8Color.png`);
  const displacementMap = new THREE.TextureLoader().load(`ca/${scanPath}/_Phi8.png`);
  const material = new THREE.MeshNormalMaterial({ 
    normalMap,
    displacementMap,
    displacementScale: 20
   });

  const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
  // const positions = geometry.attributes.position.array;
  // const newPositions = setVertexZPositions(zMap, positions);
  // geometry.setAttribute( 'position', newPositions );
  // geometry.attributes.position.needsUpdate = true;


  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const light = new THREE.AmbientLight( 0xffffff );
  scene.add( light );

  const renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor(0x37474F );
  renderer.setSize(viewer.offsetWidth, viewer.offsetHeight);
  viewer.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 5000);
  camera.position.x = 0;
  camera.position.y = -2000;
  camera.position.z = 2000;


  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = (Math.PI / 2);
  controls.maxPolarAngle = Math.PI - .05;
  controls.minAzimuthAngle = (Math.PI * -.25);
  controls.maxAzimuthAngle = (Math.PI / 4);
  controls.minZPan = 0;
  controls.maxZPan = 2500;


  function animate() {
    animationID = window.requestAnimationFrame( animate );

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render( scene, camera );
  }

  animate();
}

export const cancelAnimation = () => {
  if(animationID) window.cancelAnimationFrame(animationID);
};

export default renderFullImage