import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";

import  {loadDenim} from './loadDenim.js'

let scene, camera, renderer;

window.threeParams = {
  aspectRatio: 9 / 16,
  renderHeight: window.innerHeight,
  planeScale : 1
}


const threeInit = () => {

  scene = new THREE.Scene();

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

    renderer.setSize(Math.round(threeParams.renderHeight * threeParams.aspectRatio), threeParams.renderHeight);
    document.body.appendChild(renderer.domElement);
  })()

  const setPlane = ( async () => {
    //gridHelper
    let gridHelper = new THREE.GridHelper(1, 4, 0x888888, 0x444444);
    gridHelper.rotation.x = Math.PI * 0.5;
    gridHelper.scale.x = threeParams.aspectRatio
    gridHelper.position.z = 0.01
    scene.add(gridHelper); //helper

    loadDenim(scene)

  })()


  const ambientLight = new THREE.AmbientLight( 0xDDDDDD ); // soft white light
  scene.add( ambientLight );


  threeAnimate();
}

const threeAnimate = () => {
  renderer.render(scene, camera);

  requestAnimationFrame(threeAnimate);
}


threeInit()

/******************************* */


function onWindowResize() {
  threeParams.renderHeight= window.innerHeight
  // console.log(threeParams.renderHeight);

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

  _viewport.left,
  _viewport.right,
  _viewport.top,
  _viewport.bottom,
  _viewport.near,
  _viewport.far

  camera.left = _viewport.left;
  camera.right = _viewport.right;

  camera.updateProjectionMatrix();

  renderer.setSize(Math.round(threeParams.renderHeight * threeParams.aspectRatio), threeParams.renderHeight);
}
window.addEventListener('resize', onWindowResize);

/******************************* */


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