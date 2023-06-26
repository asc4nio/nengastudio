import './style.css'

import * as THREE from 'three';
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { loadDenimMaterial, loadDecalsMaterial } from './loadAssets.js'
import { initSaveAsImage } from './saveAsImage.js'


/////////////////////////////////////////////////////////////////////////////

let decalsColors = [
  new THREE.Color( 0xf10454 ),
  new THREE.Color( 0xa6f1ac ),
  new THREE.Color( 0x000acc ),
  new THREE.Color( 0x110f00 ),
]

window.threeState = {
  currentDecalColor : decalsColors[0],
  currentDecalMaterial: 0,
  decalsScale: 0.05,
  shootRadius: window.innerHeight / 32,
  denimTextureScale: 0.8,
}

window.switchToDecal = (_index) => {
  threeState.currentDecalMaterial = _index
  switch (threeState.currentDecalMaterial) {
    case 0:
      threeState.decalsScale = 0.05
      threeState.shootRadius = window.innerHeight / 32

      break;
    case 1:
      threeState.decalsScale = 0.05
      threeState.shootRadius = window.innerHeight / 40

      break;
    case 2:
      threeState.decalsScale = 0.05
      threeState.shootRadius = window.innerHeight / 40

      break;

    default:
      break;
  }
}

window.switchToColor = (_index) => {
  threeState.currentDecalColor = decalsColors[_index]
}


/////////////////////////////////////////////////////////////////////////////


let scene, camera, renderer, raycaster
// let helperLine;
let mouse = new THREE.Vector2();


var pointerState = {
  isPointerDown: false,
  dragStartPos: new THREE.Vector2(),
  lastDecalPos: undefined
};

let plane;
let decalsMaterials;
let decals = [];


let intersection = {
  intersects: false,
  point: new THREE.Vector3()
};
let intersects = [];


/////////////////////////////////////////////////////////////////////////////

const threeInit = async () => {
  console.log('threeInit')


  let denimMaterial = await loadDenimMaterial()
  decalsMaterials = await loadDecalsMaterial()

  switchToDecal(0)

  scene = new THREE.Scene();
  raycaster = new THREE.Raycaster();

  const setCamera = (() => {
    camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    let camDist = camera.position.z - 0;
    let heightToFit = 1; // desired height to fit
    camera.fov = 2 * Math.atan(heightToFit / (2 * camDist)) * (180 / Math.PI);
    camera.updateProjectionMatrix();

  })()

  const setRenderer = (() => {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    initSaveAsImage('save-button', renderer)

  })()

  const setLights = (() => {
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
  })()

  const setPlane = (() => {
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

  })()


  //pointer line
  // const geometry = new THREE.BufferGeometry();
  // geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  // helperLine = new THREE.Line(geometry, new THREE.LineBasicMaterial());
  // helperLine.visible = false;
  // scene.add(helperLine);

  //mouseHelper
  // mouseHelper = new THREE.Mesh(
  //   new THREE.BoxGeometry(1, 1, 10),
  //   new THREE.MeshNormalMaterial()
  // );
  // mouseHelper.visible = false;
  // scene.add(mouseHelper);

  const setListeners = (() => {
    window.addEventListener("pointerdown", function (event) {
      console.log("pointerdown");

      pointerState.isPointerDown = true;
      pointerState.dragStartPos.x = event.pageX;
      pointerState.dragStartPos.y = event.pageY;

      // pointerState.lastDecalPos = new THREE.Vector3((event.pageX/window.innerWidth)-0.5, (event.pageY/window.innerHeight)-0.5, 0);

      // pointerState.lastDecalPos = new THREE.Vector3();
      // pointerState.lastDecalPos.x = (event.clientX / window.innerWidth) * 2 - 1;
      // pointerState.lastDecalPos.y = -(event.clientY / window.innerHeight) * 2 + 1;
      // pointerState.lastDecalPos.z = 0

      // pointerStartX = event.pageX;
      // pointerStartY = event.pageY;

      // console.log(
      //   "pointerdown",
      //   pointerState.dragStartPos.x,
      //   pointerState.dragStartPos.y
      // );
    });

    window.addEventListener("pointermove", (event) => {
      console.log("pointermove");

      // if ( event.isPrimary ) {}

      if (pointerState.isPointerDown && event.isPrimary) {
        if (pointerState.lastDecalPos === undefined) {
          checkIntersection(event.clientX, event.clientY);
        }

        let diffX = Math.abs(event.pageX - pointerState.dragStartPos.x);
        let diffY = Math.abs(event.pageY - pointerState.dragStartPos.y);

        if (
          diffX > threeState.shootRadius ||
          diffY > threeState.shootRadius
        ) {
          // console.log("pointermove", diffX, diffY);
          checkIntersection(event.clientX, event.clientY);
          if (intersection.intersects) shoot();

          pointerState.dragStartPos.x = event.pageX;
          pointerState.dragStartPos.y = event.pageY;
        } else {
          return
        }
      }
    });

    window.addEventListener("pointerup", function (event) {
      console.log("pointerup");

      pointerState.isPointerDown = false;
      pointerState.lastDecalPos = undefined
    });

    /****************************************************************************** */

    window.addEventListener("resize", () => {
      console.log('resizin')
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

  })()


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
    // console.log(intersects);

    const p = intersects[0].point;
    intersection.point.copy(p);

    // const n = intersects[0].face.normal.clone();
    // n.transformDirection(plane.matrixWorld);
    // n.multiplyScalar(10);
    // n.add(intersects[0].point);

    console.log(pointerState.lastDecalPos)

    if (pointerState.lastDecalPos === undefined) {
      pointerState.lastDecalPos = new THREE.Vector3();
      pointerState.lastDecalPos.copy(intersection.point);
    }

    console.log(pointerState.lastDecalPos)



    //pointer line update
    // const positions = helperLine.geometry.attributes.position;
    // positions.setXYZ(0, p.x, p.y, p.z);
    // positions.setXYZ(1, n.x, n.y, n.z);
    // positions.needsUpdate = true;

    intersection.intersects = true;

    intersects.length = 0;
  } else {
    // console.log(intersects)
    intersection.intersects = false;
  }
}

function shoot() {
  // set orientation
  const orientation = new THREE.Euler();

  console.log(pointerState.lastDecalPos)

  // if (pointerState.lastDecalPos !== undefined) {

  let direction = new THREE.Vector3();
  direction.subVectors(pointerState.lastDecalPos, intersection.point);

  let dir = (Math.atan2(direction.x, direction.y) + Math.PI / 2) * -1;
  orientation.z = dir;
  console.log(dir)

  // } else {
  //   orientation.copy(plane.rotation);
  // }

  // set position
  const position = new THREE.Vector3();
  position.copy(intersection.point);
  // console.log(position.x, position.y)

  // set size
  const size = new THREE.Vector3(threeState.decalsScale, threeState.decalsScale, 1);

  // set material
  const material = decalsMaterials[threeState.currentDecalMaterial].clone();
  // material.color.setHex(Math.random() * 0xffffff);
  // material.color.setHex(0xFFFF00);

  material.color = threeState.currentDecalColor

  const m = new THREE.Mesh(
    new DecalGeometry(plane, position, orientation, size),
    material
  );

  decals.push(m);
  scene.add(m);

  pointerState.lastDecalPos = position;

}



/////////////////////////////////////////////////////////////////////////////



window.addEventListener('load', function (event) {
  threeInit();
});