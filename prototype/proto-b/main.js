let subRes = 8;
let gridRes = 5 * subRes;
let gridSize = 16;

let mousePos;
let brushes = [];
let activeBrush = 0;
let denimImage;

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function preload() {
  brushes[0] = loadImage("./assets/brush01.png");
  brushes[1] = loadImage("./assets/brush02.png");
  denimImage = loadImage("./assets/denim-bg02.jpg");
}

function setup() {
  var myCanvas = createCanvas(gridSize * gridRes, gridSize * gridRes);
  myCanvas.parent("p5js");

  background(220);
  noSmooth();

  image(
    denimImage,
    0,
    0,
    gridRes * gridSize,
    gridRes * gridSize,
    0,
    0,
    (gridRes * gridSize) / subRes,
    (gridRes * gridSize) / subRes
  );

  mousePos = createVector();
}

function draw() {
  // background(220);

  mousePos.x = mouseX;
  mousePos.y = mouseY;

  // console.log(mousePos);
  // for (let i = 0; i < gridSize; i++) {
  //   line(i * gridRes, 0, i * gridRes, height);
  // }
  // for (let i = 0; i < gridSize; i++) {
  //   line(0, i * gridRes, width, i * gridRes);
  // }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

const getItem = () => {
  let limitedMousePos = createVector();
  mousePos.x > gridRes * gridSize
    ? (limitedMousePos.x = gridRes * gridSize)
    : (limitedMousePos.x = mousePos.x);
  mousePos.y > gridRes * gridSize
    ? (limitedMousePos.y = gridRes * gridSize)
    : (limitedMousePos.y = mousePos.y);

  // console.log(limitedMousePos);

  ////////////////////////////////////////

  let xIndex = Math.floor(limitedMousePos.x / gridRes);
  let yIndex = Math.floor(limitedMousePos.y / gridRes);
  console.log(xIndex, yIndex);

  ////////////////////////////////////////

  // push();
  // fill(50);
  // rect(xIndex * gridRes, yIndex * gridRes, gridRes, gridRes);
  // pop();

  copy(
    brushes[activeBrush],
    0,
    0,
    8,
    8,
    xIndex * gridRes,
    yIndex * gridRes,
    gridRes,
    gridRes
  );
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
