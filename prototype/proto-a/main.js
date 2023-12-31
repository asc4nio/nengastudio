import * as THREE from "three";
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";

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
  // canShoot: false,
  actionStartPos: new THREE.Vector2(),
};

/////////////////////////////////////////////////////////////////////////////

let lastDecalPos;

const textureLoader = new THREE.TextureLoader();
const decalDiffuse = textureLoader.load("./assets/test-02-diffuse.png");
decalDiffuse.colorSpace = THREE.SRGBColorSpace;
const decalNormal = textureLoader.load("./assets/test-02-normal.jpg");
const decalMaterial = new THREE.MeshStandardMaterial({
  specular: 0x444444,
  map: decalDiffuse,
  normalMap: decalNormal,
  normalScale: new THREE.Vector2(1, 1),
  shininess: 10,
  transparent: true,
  depthTest: true,
  depthWrite: false,
  polygonOffset: true,
  polygonOffsetFactor: -4,
  wireframe: false,
});

let decals = [];

const position = new THREE.Vector3();
const orientation = new THREE.Euler();
const size = new THREE.Vector3(10, 10, 10);

/////////////////////////////////////////////////////////////////////////////

document.getElementById("save-button").addEventListener("click", () => {
  saveAsImage();
});

function saveAsImage() {
  let link = document.createElement("a");
  link.download = "image.png";

  renderer.domElement.toBlob(function (blob) {
    link.href = URL.createObjectURL(blob);
    link.click();
  }, "image/png");
}

/////////////////////////////////////////////////////////////////////////////

const denimNormalTexture = new THREE.TextureLoader().load(
  "./assets/denim-normal.jpg"
);
denimNormalTexture.wrapS = THREE.RepeatWrapping;
denimNormalTexture.wrapT = THREE.RepeatWrapping;
denimNormalTexture.repeat.set(
  0.5 * (window.innerWidth / window.innerHeight),
  0.5
);

const denimRoughnessTexture = new THREE.TextureLoader().load(
  "./assets/denim-roughness.jpg"
);
denimRoughnessTexture.wrapS = THREE.RepeatWrapping;
denimRoughnessTexture.wrapT = THREE.RepeatWrapping;
denimRoughnessTexture.repeat.set(
  0.5 * (window.innerWidth / window.innerHeight),
  0.5
);

const denimBumpTexture = new THREE.TextureLoader().load(
  "./assets/denim-bump.jpg"
);
denimBumpTexture.wrapS = THREE.RepeatWrapping;
denimBumpTexture.wrapT = THREE.RepeatWrapping;
denimBumpTexture.repeat.set(
  0.5 * (window.innerWidth / window.innerHeight),
  0.5
);

const denimDiffuseTexture = new THREE.TextureLoader().load(
  "./assets/denim-diffuse.jpg"
);
denimDiffuseTexture.wrapS = THREE.RepeatWrapping;
denimDiffuseTexture.wrapT = THREE.RepeatWrapping;
denimDiffuseTexture.repeat.set(
  0.5 * (window.innerWidth / window.innerHeight),
  0.5
);
denimDiffuseTexture.colorSpace = THREE.SRGBColorSpace;

const denimMaterial = new THREE.MeshStandardMaterial({
  // specular: 0x444444,
  map: denimDiffuseTexture,
  normalMap: denimNormalTexture,
  normalScale: new THREE.Vector2(1, 1),
  roughnessMap: denimRoughnessTexture,
  bumpMap: denimBumpTexture,
  // shininess: 30,
  transparent: true,
  depthTest: true,
  depthWrite: false,
  polygonOffset: true,
  // polygonOffsetFactor: -4,
  wireframe: false,
});

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

  pointerState.shootRadius = window.innerHeight / 15

  let camDist = camera.position.z - 0;
  let heightToFit = 1; // desired height to fit
  camera.fov = 2 * Math.atan(heightToFit / (2 * camDist)) * (180 / Math.PI);
  camera.updateProjectionMatrix();

  //renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //gridHelper
  let gridHelper = new THREE.GridHelper(4, 4, 0x888888, 0x444444);
  gridHelper.rotation.x = Math.PI * 0.5;
  scene.add(gridHelper); //helper

  //lights
  scene.add(new THREE.AmbientLight(0x111111));

  const dirLight3 = new THREE.DirectionalLight(0xccffff, 1);
  dirLight3.position.set(1, 1, 1);
  scene.add(dirLight3);

  const dirLight1 = new THREE.DirectionalLight(0xffe5cc, 0.5);
  dirLight1.position.set(-1, 1, 1);
  scene.add(dirLight1);

  // const dirLight2 = new THREE.DirectionalLight(0xccccff, 1);
  // dirLight2.position.set(1, 0.75, 0.2);
  // scene.add(dirLight2);

  //plane
  const planeGeometry = new THREE.PlaneGeometry(
    1 * (window.innerWidth / window.innerHeight),
    1
  );
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide,
  });
  plane = new THREE.Mesh(planeGeometry, denimMaterial);
  // plane.scale.set(0.9, 0.9, 1);
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
        // pointerState.canShoot = true;
        // console.log("canShoot", pointerState.canShoot);

        checkIntersection(event.clientX, event.clientY);
        if (intersection.intersects) shoot();

        // pointerState.canShoot = false;
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

function shoot() {
  let dir;

  if (lastDecalPos) {
    let direction = new THREE.Vector3();
    direction.subVectors(lastDecalPos, intersection.point);

    dir = Math.atan2(direction.y, direction.x) + Math.PI / 2;
    console.log(dir);
  }

  position.copy(intersection.point);
  orientation.copy(mouseHelper.rotation);

  orientation.z = dir;

  // if (params.rotate) orientation.z = Math.random() * 2 * Math.PI;

  const scale = 0.05;
  size.set(scale, scale, scale);

  const material = decalMaterial.clone();
  material.color.setHex(Math.random() * 0xffffff);
  // material.color.setHex(0x808080);

  const m = new THREE.Mesh(
    new DecalGeometry(plane, position, orientation, size),
    material
  );

  decals.push(m);
  scene.add(m);

  lastDecalPos = position;
}

/////////////////////////////////////////////////////////////////////////////

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

threeInit();
