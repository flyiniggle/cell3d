import * as THREE from '/external/three/build/three.module.js'
import { OrbitControls } from '/app/components/OrbitControls.js';


let animationID;

function renderTimeSeries(viewer, scanPath, specs) {
  const {
    scanFolders,
    width,
    height
  } = specs;

  const scene = new THREE.Scene();

  // Array<[nomralMap, displacementMap]>
  const maps = scanFolders.map(dir => {
    return [
      new THREE.TextureLoader().load(`ca/${dir}/${scanPath}/_Phi8Color.png`),
      new THREE.TextureLoader().load(`ca/${dir}/${scanPath}/_Phi8.png`)
    ]
  });
  
  const materials = maps.map(([normalMap, displacementMap]) => new THREE.MeshNormalMaterial({ 
    normalMap,
    displacementMap,
    displacementScale: 20
   }));
   
  const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);

  const mesh = new THREE.Mesh(geometry, materials[0]);
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

    const tick = Math.floor(animationID / 10);
    const frame = tick % materials.length;

    mesh.material = materials[frame];
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render( scene, camera );
  }

  animate();

}

export const cancelAnimation = () => {
  if(animationID) window.cancelAnimationFrame(animationID);
};

export default renderTimeSeries