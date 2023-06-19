import './style.css'

import * as THREE from 'three';
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { loadDenimMaterial, loadDecalsMaterial } from './loadAssets.js'
import { initSaveAsImage } from './saveAsImage.js'


/////////////////////////////////////////////////////////////////////////////

window.threeState = {
  currentDecalMaterial: 0,
  denimTextureScale: 0.8,
  decalsScale: 0.03
}

/////////////////////////////////////////////////////////////////////////////


let scene, camera, renderer, raycaster
// let helperLine;
let mouse = new THREE.Vector2();

var pointerState = {
  shootRadius: 20,
  isPointerDown: false,
  actionStartPos: new THREE.Vector2(),
  // shootRadius: 20,
  shootRadius : window.innerHeight / 24
};

let plane;
let lastDecalPos = undefined
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
      pointerState.isPointerDown = true;
      pointerState.actionStartPos.x = event.pageX;
      pointerState.actionStartPos.y = event.pageY;

      // lastDecalPos = new THREE.Vector3((event.pageX/window.innerWidth)-0.5, (event.pageY/window.innerHeight)-0.5, 0);

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
          checkIntersection(event.clientX, event.clientY);
          if (intersection.intersects) shoot();

          pointerState.actionStartPos.x = event.pageX;
          pointerState.actionStartPos.y = event.pageY;
        } else {
          return
        }
      }
    });

    window.addEventListener("pointerup", function (event) {
      console.log("pointerup");

      pointerState.isPointerDown = false;
      lastDecalPos = undefined
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

    const n = intersects[0].face.normal.clone();
    n.transformDirection(plane.matrixWorld);
    n.multiplyScalar(10);
    n.add(intersects[0].point);


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
  if (lastDecalPos !== undefined) {

    let direction = new THREE.Vector3();
    direction.subVectors(lastDecalPos, intersection.point);

    let dir = (Math.atan2(direction.x, direction.y) + Math.PI / 2)*-1;
    orientation.z = dir;
    console.log(dir)

  } else {
    orientation.copy(plane.rotation);
  }

  // set position
  const position = new THREE.Vector3();
  position.copy(intersection.point);
  // console.log(position.x, position.y)

  // set size
  const size = new THREE.Vector3(threeState.decalsScale, threeState.decalsScale, 1);

  // set material
  const material = decalsMaterials[threeState.currentDecalMaterial].clone();
  // material.color.setHex(Math.random() * 0xffffff);
  material.color.setHex(0xFFFF00);

  const m = new THREE.Mesh(
    new DecalGeometry(plane, position, orientation, size),
    material
  );

  decals.push(m);
  scene.add(m);

  lastDecalPos = position;
}

/////////////////////////////////////////////////////////////////////////////



window.addEventListener('load', function(event) {
  threeInit();
});