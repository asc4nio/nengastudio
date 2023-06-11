import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";

let scene, camera, renderer;
let plane;
let raycaster, helperLine;
let mouseHelper;

const mouse = new THREE.Vector2();
const intersects = [];
const intersection = {
  intersects: false,
  point: new THREE.Vector3(),
  normal: new THREE.Vector3(),
};

var pointerState = {
  shootRadius: 20,
  isPointerDown: false,
  canShoot: false,
  actionStartPos: new THREE.Vector2(),
};

/////////////////////////////////////////////////////////////////////////////

const threeInit = () => {
  scene = new THREE.Scene();
  raycaster = new THREE.Raycaster();

  //camera
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  let camDist = camera.position.z - 1;
  let heightToFit = 1; // desired height to fit
  camera.fov = 2 * Math.atan(heightToFit / (2 * camDist)) * (180 / Math.PI);
  camera.updateProjectionMatrix();

  //renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //gridHelper
  let gridHelper = new THREE.GridHelper(4, 4, 0x888888, 0x444444);
  gridHelper.rotation.x = Math.PI * 0.5;
  scene.add(gridHelper); //helper

  //plane
  const planeGeometry = new THREE.PlaneGeometry(1, 1);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide,
  });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  //plane.scale.set(0.9, 0.9, 1);
  scene.add(plane);

  //pointer line
  const geometry = new THREE.BufferGeometry();
  geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  helperLine = new THREE.Line(geometry, new THREE.LineBasicMaterial());
  scene.add(helperLine);

  //mouseHelper
  mouseHelper = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 10),
    new THREE.MeshNormalMaterial()
  );
  mouseHelper.visible = false;
  scene.add(mouseHelper);

  window.addEventListener("pointerdown", function (event) {
    pointerState.isPointerDown = true;
    pointerState.actionStartPos.x = event.pageX;
    pointerState.actionStartPos.y = event.pageY;
    // pointerStartX = event.pageX;
    // pointerStartY = event.pageY;

    console.log(
      "pointerdown",
      pointerState.actionStartPos.x,
      pointerState.actionStartPos.y
    );
  });

  window.addEventListener("pointermove", (event) => {
    if (pointerState.isPointerDown) {
      let diffX = Math.abs(event.pageX - pointerState.actionStartPos.x);
      let diffY = Math.abs(event.pageY - pointerState.actionStartPos.y);

      if (
        diffX > pointerState.shootRadius ||
        diffY > pointerState.shootRadius
      ) {
        // console.log("pointermove", diffX, diffY);
        pointerState.canShoot = true;
        console.log("canShoot", pointerState.canShoot);

        checkIntersection(event.clientX, event.clientY);
        // if (intersection.intersects) shoot();

        pointerState.canShoot = false;
        pointerState.actionStartPos.x = event.pageX;
        pointerState.actionStartPos.y = event.pageY;
      } else {
        // console.log("canShoot", pointerState.canShoot);
      }
    }
  });

  window.addEventListener("pointerup", function (event) {
    console.log("pointerup");

    pointerState.isPointerDown = false;
  });

  threeAnimate();
};

const threeAnimate = () => {
  renderer.render(scene, camera);

  requestAnimationFrame(threeAnimate);
};

/////////////////////////////////////////////////////////////////////////////

function checkIntersection(x, y) {
  // console.log("checkIntersection", x, y);

  if (plane === undefined) return;

  mouse.x = (x / window.innerWidth) * 2 - 1;
  mouse.y = -(y / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  raycaster.intersectObject(plane, false, intersects);

  if (intersects.length > 0) {
    console.log(intersects);

    const p = intersects[0].point;
    mouseHelper.position.copy(p);
    intersection.point.copy(p);

    const n = intersects[0].face.normal.clone();
    n.transformDirection(plane.matrixWorld);
    n.multiplyScalar(10);
    n.add(intersects[0].point);

    intersection.normal.copy(intersects[0].face.normal);
    mouseHelper.lookAt(n);

    const positions = helperLine.geometry.attributes.position;
    positions.setXYZ(0, p.x, p.y, p.z);
    positions.setXYZ(1, n.x, n.y, n.z);
    positions.needsUpdate = true;

    intersection.intersects = true;

    intersects.length = 0;
  } else {
    // console.log(intersects)
    intersection.intersects = false;
  }
}

/////////////////////////////////////////////////////////////////////////////

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

threeInit();
