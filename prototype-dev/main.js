import './style.css'

import * as THREE from 'three';
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { loadDenimMaterial, loadDecalsMaterial } from './loadAssets.js'
import { initSaveAsImage } from './saveAsImage.js'


/////////////////////////////////////////////////////////////////////////////

let decalsColors = [
  new THREE.Color(0xf10454),
  new THREE.Color(0xa6f1ac),
  new THREE.Color(0x000acc),
  new THREE.Color(0x110f00),
]

window.threeState = {
  currentDecalColor: decalsColors[0],
  currentDecalMaterial: 0,
  decalsScale: 0.05,
  shootRadius: window.innerHeight / 32,
  denimTextureScale: 0.6,
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
  console.debug('threeInit')

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
    scene.add(new THREE.AmbientLight(0x808080));


    const dirLight3 = new THREE.DirectionalLight(0xdbfffa, 0.5);
    dirLight3.position.set(1, 1, 1);
    scene.add(dirLight3);

    const dirLight1 = new THREE.DirectionalLight(0xffffdb, 1);
    dirLight1.position.set(-1, 1, 1);
    scene.add(dirLight1);

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



  const setListeners = (() => {
    window.addEventListener("pointerdown", function (event) {
      // console.debug("pointerdown");

      pointerState.isPointerDown = true;
      pointerState.dragStartPos.x = event.pageX;
      pointerState.dragStartPos.y = event.pageY;

    });

    window.addEventListener("pointermove", (event) => {
      // console.debug("pointermove");

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
          // console.debug("pointermove", diffX, diffY);
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
      // console.debug("pointerup");

      pointerState.isPointerDown = false;
      pointerState.lastDecalPos = undefined
    });

    /****************************************************************************** */

    window.addEventListener("resize", () => {
      // console.debug('resizin')
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

  })()


  const setDomControls = (() => {

    const switchDecalButtonClass = (_target)=>{
      let decalsButtons = document.getElementsByClassName('decal')
      for (let button of decalsButtons){
        button.classList = 'decal'
      }
      console.log(_target)
      _target.classList = 'decal is--active'
    }

    const switchColorButtonClass = (_target)=>{
      let colorButtons = document.getElementsByClassName('color')
      for (let button of colorButtons){
        button.classList = 'color'
      }
      _target.classList = 'color is--active'
    }


    document.getElementById('clear-button').addEventListener("click", () => {
      console.debug('clear-button')
      clearDecals()
    })
    document.getElementById('undo-button').addEventListener("click", () => {
      console.debug('undo-button')
      removeLastDecal()
    })
    /** */
    document.getElementById('decal0').addEventListener("click", (e) => {
      console.debug('decal0', e)
      switchToDecal(0)
      switchDecalButtonClass(e.target)

      // let decalsButtons = document.getElementsByClassName('decal')
      // for (let button of decalsButtons){
      //   button.classList = 'decal'
      // }
      // e.target.classList = 'decal is--active'
    })
    document.getElementById('decal1').addEventListener("click", (e) => {
      console.debug('decal1')
      switchToDecal(1)
      switchDecalButtonClass(e.target)


      // let decalsButtons = document.getElementsByClassName('decal')
      // for (let button of decalsButtons){
      //   button.classList = 'decal'
      // }
      // e.target.classList = 'decal is--active'
    })
    document.getElementById('decal2').addEventListener("click", (e) => {
      console.debug('decal2')
      switchToDecal(2)
      switchDecalButtonClass(e.target)


      // let decalsButtons = document.getElementsByClassName('decal')
      // for (let button of decalsButtons){
      //   button.classList = 'decal'
      // }
      // e.target.classList = 'decal is--active'

    })
    /** */
    document.getElementById('color0').addEventListener("click", (e) => {
      console.debug('color0')
      switchToColor(0)
      switchColorButtonClass(e.target)

      // let colorButtons = document.getElementsByClassName('color')
      // for (let button of colorButtons){
      //   button.classList = 'color'
      // }
      // e.target.classList = 'color is--active'
    })
    document.getElementById('color1').addEventListener("click", (e) => {
      console.debug('color1')
      switchToColor(1)
      switchColorButtonClass(e.target)


      // let colorButtons = document.getElementsByClassName('color')
      // for (let button of colorButtons){
      //   button.classList = 'color'
      // }
      // e.target.classList = 'color is--active'

    })
    document.getElementById('color2').addEventListener("click", (e) => {
      console.debug('color2')
      switchToColor(2)
      switchColorButtonClass(e.target)


      // let colorButtons = document.getElementsByClassName('color')
      // for (let button of colorButtons){
      //   button.classList = 'color'
      // }
      // e.target.classList = 'color is--active'
    })
    document.getElementById('color3').addEventListener("click", (e) => {
      console.debug('color3')
      switchToColor(3)
      switchColorButtonClass(e.target)


      // let colorButtons = document.getElementsByClassName('color')
      // for (let button of colorButtons){
      //   button.classList = 'color'
      // }
      // e.target.classList = 'color is--active'

    })

  })()


  threeAnimate();
};

const threeAnimate = () => {
  renderer.render(scene, camera);

  requestAnimationFrame(threeAnimate);
};

/////////////////////////////////////////////////////////////////////////////

function checkIntersection(x, y) {
  // console.debug("checkIntersection", x, y);

  if (plane === undefined) return;

  mouse.x = (x / window.innerWidth) * 2 - 1;
  mouse.y = -(y / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  raycaster.intersectObject(plane, false, intersects);

  if (intersects.length > 0) {
    // console.debug(intersects);

    const p = intersects[0].point;
    intersection.point.copy(p);

    if (pointerState.lastDecalPos === undefined) {
      pointerState.lastDecalPos = new THREE.Vector3();
      pointerState.lastDecalPos.copy(intersection.point);
    }
    intersection.intersects = true;

    intersects.length = 0;
  } else {
    // console.debug(intersects)
    intersection.intersects = false;
  }
}

function shoot() {
  // set orientation
  const orientation = new THREE.Euler();

  let direction = new THREE.Vector3();
  direction.subVectors(pointerState.lastDecalPos, intersection.point);

  let dir = (Math.atan2(direction.x, direction.y) + Math.PI / 2) * -1;
  orientation.z = dir;
  // console.debug(dir)

  // set position
  const position = new THREE.Vector3();
  position.copy(intersection.point);
  // console.debug(position.x, position.y)

  // set size
  const size = new THREE.Vector3(threeState.decalsScale, threeState.decalsScale, 1);

  // set material
  const material = decalsMaterials[threeState.currentDecalMaterial].clone();

  material.color = threeState.currentDecalColor

  const m = new THREE.Mesh(
    new DecalGeometry(plane, position, orientation, size),
    material
  );

  decals.push(m);
  scene.add(m);

  pointerState.lastDecalPos = position;

}

function clearDecals() {
  decals.forEach(function (d) {
    scene.remove(d);
  });
  decals.length = 0;
}

function removeLastDecal() {
  scene.remove(decals[decals.length - 1])
  decals.pop()
}

/////////////////////////////////////////////////////////////////////////////


threeInit();


// window.addEventListener('load', function (event) {
// });