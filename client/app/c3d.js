// import * as THREE from 'https://unpkg.com/three@0.145.0/build/three.module.js';
// import {
//   OrbitControls
// } from 'https://unpkg.com/three@0.145.0/examples/jsm/controls/OrbitControls';
// import * as THREE from 'three';
// import {
//   OrbitControls
// } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from '/external/three/build/three.module.js'
import { OrbitControls } from '/app/components/OrbitControls.js';
import setVertexZPositions from '/app/lib/setVertexZPositions.js';


export const loadImage = async () => {
  const response = await fetch('resources/zmap');
  const imageData = await response.json();

  return imageData
}

export default async function main(viewer) {
  const {
    width,
    height,
    zMap
  } = await loadImage();

  const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
  const scene = new THREE.Scene();
  const texture = new THREE.TextureLoader().load('images/_Phi8Color.png');
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const positions = geometry.attributes.position.array;
  const newPositions = setVertexZPositions(zMap, positions);

  geometry.setAttribute( 'position', newPositions );
  geometry.attributes.position.needsUpdate = true;

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor(0x555555 );
  renderer.setSize(viewer.offsetWidth, viewer.offsetHeight);
  viewer.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 5000);


  camera.position.z = 1000;

  const controls = new OrbitControls(camera, renderer.domElement);

  function animate() {

    requestAnimationFrame( animate );

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    renderer.render( scene, camera );

  }
  animate();

  // mesh.rotation.x = -.2;
  // mesh.rotation.y = -.2;
  // mesh.rotation.z= .5;

  // renderer.render(scene, camera);

  console.log('rendered')
}