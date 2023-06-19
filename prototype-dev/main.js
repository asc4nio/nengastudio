import './style.css'

import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";

import { loadDenim } from './loadDenim.js'

/******************************* */


let scene, camera, renderer;

window.threeParams = {
  aspectRatio: 9 / 16,
  renderHeight: window.innerHeight,
  planeScale: 0.66
}
threeParams.renderWidth = Math.round(threeParams.renderHeight * threeParams.aspectRatio)
/******************************* */

let raycaster, helperLine, mouseHelper;

// const mouse = new THREE.Vector2();

var pointerState = {
  currentPos: new THREE.Vector2(),
  shootRadius: 20,
  isPointerDown: false,
  // canShoot: false,
  actionStartPos: new THREE.Vector2(),
};

const intersects = [];
const intersection = {
  intersects: false,
  point: new THREE.Vector3(),
  normal: new THREE.Vector3(),
};

/******************************* */



const threeInit = () => {

  scene = new THREE.Scene();
  raycaster = new THREE.Raycaster();


  const setCamera = (() => {

    let w = threeParams.renderHeight * threeParams.aspectRatio;
    let h = threeParams.renderHeight;
    let viewSize = 1;

    let _viewport = {
      viewSize: viewSize,
      aspectRatio: threeParams.aspectRatio,
      left: (-threeParams.aspectRatio * viewSize) / 2,
      right: (threeParams.aspectRatio * viewSize) / 2,
      top: viewSize / 2,
      bottom: -viewSize / 2,
      near: -100,
      far: 100
    }

    camera = new THREE.OrthographicCamera(
      _viewport.left,
      _viewport.right,
      _viewport.top,
      _viewport.bottom,
      _viewport.near,
      _viewport.far
    );

    // camera.position.z=-1

    camera.updateProjectionMatrix()

  })()
  const setRenderer = (() => {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });

    renderer.setSize(threeParams.renderWidth, threeParams.renderHeight);
    document.body.appendChild(renderer.domElement);
  })()

  const setPlane = (async () => {
    //gridHelper
    let gridHelper = new THREE.GridHelper(1, 4, 0x888888, 0x444444);
    gridHelper.rotation.x = Math.PI * 0.5;
    gridHelper.scale.x = threeParams.aspectRatio
    gridHelper.position.z = 0.01
    scene.add(gridHelper); //helper

    loadDenim(scene)

  })()

  pointerState.shootRadius = window.innerHeight / 15

  //pointer line
  const geometry = new THREE.BufferGeometry();
  geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  helperLine = new THREE.Line(geometry, new THREE.LineBasicMaterial());
  scene.add(helperLine);


  mouseHelper
  mouseHelper = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 10),
    new THREE.MeshNormalMaterial()
  );
  mouseHelper.visible = false;
  scene.add(mouseHelper);


  const addListeners = (() => {
    renderer.domElement.addEventListener("pointerdown", function (event) {
      /*
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
      */
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      // console.log(event)

      let eX = Math.round(event.offsetX)
      let eY = Math.round(event.offsetY)

      if (eX > 0  && eX < threeParams.renderWidth && eY>0 && eY < threeParams.renderHeight){
        checkIntersection(eX, eY);
      }


      

      // console.log(event.pageX, event.pageY)
      /*
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
      */
    });

    renderer.domElement.addEventListener("pointerup", function (event) {
      console.log("pointerup");

      // pointerState.isPointerDown = false;
    });
  })()



  const ambientLight = new THREE.AmbientLight(0xDDDDDD); // soft white light
  scene.add(ambientLight);


  threeAnimate();
}

const threeAnimate = () => {
  renderer.render(scene, camera);

  requestAnimationFrame(threeAnimate);
}


threeInit()

/******************************* */


function onWindowResize() {
  threeParams.renderHeight = window.innerHeight
  threeParams.renderWidth = Math.round(threeParams.renderHeight * threeParams.aspectRatio)
  // console.log(threeParams.renderHeight);

  let w = threeParams.renderWidth ;
  let h = threeParams.renderHeight;
  let viewSize = 1;

  let _viewport = {
    viewSize: viewSize,
    aspectRatio: threeParams.aspectRatio,
    left: (-threeParams.aspectRatio * viewSize) / 2,
    right: (threeParams.aspectRatio * viewSize) / 2,
    top: viewSize / 2,
    bottom: -viewSize / 2,
    near: -100,
    far: 100
  }

  _viewport.left,
    _viewport.right,
    _viewport.top,
    _viewport.bottom,
    _viewport.near,
    _viewport.far

  camera.left = _viewport.left;
  camera.right = _viewport.right;

  camera.updateProjectionMatrix();

  renderer.setSize(threeParams.renderWidth, threeParams.renderHeight);
}
window.addEventListener('resize', onWindowResize);

/******************************* */

function checkIntersection(x, y) {
  console.log("checkIntersection", x, y);

  if (plane === undefined) return;

  pointerState.currentPos.x = (x / window.innerWidth) * 2 - 1;
  pointerState.currentPos.y = -(y / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointerState.currentPos, camera);
  raycaster.intersectObject(plane, false, intersects);

  if (intersects.length > 0) {

    console.log(intersects);


    // const p = intersects[0].point;
    // mouseHelper.position.copy(p);
    // intersection.point.copy(p);

    // const n = intersects[0].face.normal.clone();
    // n.transformDirection(plane.matrixWorld);
    // n.multiplyScalar(10);
    // n.add(intersects[0].point);

    // intersection.normal.copy(intersects[0].face.normal);
    // mouseHelper.lookAt(n);

    // const positions = helperLine.geometry.attributes.position;
    // positions.setXYZ(0, p.x, p.y, p.z);
    // positions.setXYZ(1, n.x, n.y, n.z);
    // positions.needsUpdate = true;
    

    // intersection.intersects = true;

    intersects.length = 0;
  } else {
    // console.log(intersects)
    intersection.intersects = false;
  }


}


// function fitCamera(camera, contWidth, contHeight) {
//   console.log('fitCamera')
//   camera.aspect = contWidth / contHeight;

//   if (camera.aspect > threeParams.fitCameraAspectRatio) {
//     // window too large
//     camera.fov = threeParams.fov;


//   } else {
//     // window too narrow
//     const cameraHeight = Math.tan(THREE.MathUtils.degToRad(threeParams.fov / 2));
//     const ratio = camera.aspect / threeParams.fitCameraAspectRatio;
//     const newCameraHeight = cameraHeight / ratio;
//     camera.fov = THREE.MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
//   }
//   camera.updateProjectionMatrix();
// };


/*
import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
*/