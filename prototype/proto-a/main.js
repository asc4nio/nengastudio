import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";

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
