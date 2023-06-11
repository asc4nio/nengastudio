let res = 40;
let size = 10;

let mousePos;
let brushes = [];
let activeBrush = 0;

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function preload() {
  brushes[0] = loadImage("./assets/brush01.png");
  brushes[1] = loadImage("./assets/brush02.png");
}

function setup() {
  var myCanvas = createCanvas(size * res, size * res);
  myCanvas.parent("p5js");

  background(220);
  noSmooth();

  mousePos = createVector();
}

function draw() {
  // background(220);

  mousePos.x = mouseX;
  mousePos.y = mouseY;

  // console.log(mousePos);
  for (let i = 0; i < size; i++) {
    line(i * res, 0, i * res, height);
  }
  for (let i = 0; i < size; i++) {
    line(0, i * res, width, i * res);
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

const getItem = () => {
  let limitedMousePos = createVector();
  mousePos.x > res * size
    ? (limitedMousePos.x = res * size)
    : (limitedMousePos.x = mousePos.x);
  mousePos.y > res * size
    ? (limitedMousePos.y = res * size)
    : (limitedMousePos.y = mousePos.y);

  // console.log(limitedMousePos);

  ////////////////////////////////////////

  let xIndex = Math.floor(limitedMousePos.x / res);
  let yIndex = Math.floor(limitedMousePos.y / res);
  console.log(xIndex, yIndex);

  ////////////////////////////////////////

  // push();
  // fill(50);
  // rect(xIndex * res, yIndex * res, res, res);
  // pop();

  copy(brushes[activeBrush], 0, 0, 8, 8, xIndex * res, yIndex * res, res, res);
};

const hoverItem = () => {};

let pointerDown = false;
// let canShoot = false;

window.addEventListener("pointerdown", function (event) {
  pointerDown = true;
  // console.log("pointerdown", pointerStartX, pointerStartY);
});

window.addEventListener("pointermove", (event) => {
  if (pointerDown) {
    console.log("doing");

    getItem();
  }
});

window.addEventListener("pointerup", function (event) {
  // console.log("pointerup");

  pointerDown = false;
});
