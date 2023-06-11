import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // fitCamera();
  // renderer.setSize(container.offsetWidth, container.offsetHeight);
  // renderer.setPixelRatio(window.devicePixelRatio);
}
window.addEventListener("resize", onWindowResize);

/*
let container, camera, scene, renderer;
let mesh;

function init() {
  container = document.querySelector("#threejs");

  // CAMERA
  camera = new THREE.PerspectiveCamera(
    30,
    container.offsetWidth / container.offsetHeight,
    0.25,
    20
  );
  camera.position.set(0, 0, 5);

  // fitCamera();

  // SCENE
  scene = new THREE.Scene();

  let gridHelper = new THREE.GridHelper(2, 4, 0x888888, 0x444444);
  gridHelper.rotation.x = Math.PI * 0.5;
  scene.add(gridHelper); //helper

  // RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);

  //PLANE
  // const planeGeometry = new THREE.PlaneGeometry(1 * (container.offsetWidth / container.offsetHeight), 1);
  const planeGeometry = new THREE.PlaneGeometry(1, 1);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  mesh = new THREE.Mesh(planeGeometry, planeMaterial);
  //   mesh.scale.set(0.9, 0.9, 1);
  scene.add(mesh);

  animate();
}

function animate() {
  // controls.update();

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

const fitCamera = () => {
  camera.aspect = container.offsetWidth / container.offsetHeight;

  let dist = camera.position.z - 1;
  let height = 1; // desired height to fit
  camera.fov = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI);
  camera.updateProjectionMatrix();
};

function onWindowResize() {
  // fitCamera();
  // renderer.setSize(container.offsetWidth, container.offsetHeight);
  // renderer.setPixelRatio(window.devicePixelRatio);
}
window.addEventListener("resize", onWindowResize);

init();
*/
