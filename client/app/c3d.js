// import * as THREE from 'https://unpkg.com/three@0.145.0/build/three.module.js';
// import {
//   OrbitControls
// } from 'https://unpkg.com/three@0.145.0/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';

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
  const newPositions = []

  for (let i = 0; i < positions.length; i += 3) {
      const v = new THREE.Vector3(positions[i], positions[i + 1], zMap[(i/3)])

      newPositions.push(v.x);
      newPositions.push(v.y);
      newPositions.push(v.z / 15);
  }
  geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(newPositions), 3 ) )
  geometry.attributes.position.needsUpdate = true

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor(0x555555 );
  renderer.setSize(viewer.offsetWidth, viewer.offsetHeight);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 5000);

  const controls = new OrbitControls(camera, renderer.domElement);

  const geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
  const material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const cube = new THREE.Mesh( geometry2, material2 );
  scene.add( cube );

  viewer.appendChild(renderer.domElement);

  camera.position.z = 1000;

  function animate() {
    requestAnimationFrame( animate );

    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.001;

    renderer.render( scene, camera );
  };
  animate();
  // mesh.rotation.x = .5;
  // mesh.rotation.y = .1;

  // renderer.render( scene, camera );

  console.log('rendered')
}