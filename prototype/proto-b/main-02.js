let radio, button;
let paintLayer;

let gridRes = 8;
let gridSize = 24;
let pixelSize = 6

let mousePos;
let brushes = [];
let activeBrush = 0;
let denimImage;

let lastItemPainted
let canvasSize

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function preload() {
  brushes[0] = loadImage("./assets/brush01.png");
  brushes[1] = loadImage("./assets/brush02.png");
  denimImage = loadImage("./assets/denim-bg02.jpg");
}

function setup() {
  canvasSize = gridSize * gridRes * pixelSize
  var myCanvas = createCanvas(canvasSize, canvasSize);
  paintLayer = createGraphics(canvasSize, canvasSize);

  myCanvas.parent("p5js");

  background(220);
  noSmooth();

  radio = createRadio();
  radio.option("1", "brushA");
  radio.option("2", "brushB");
  radio.selected("1");

  button = createButton("clear");
  button.mousePressed(clearPaintLayer);


  mousePos = createVector();
  lastItemPainted = createVector();
}

function draw() {
  // background(220);
  let val = radio.value();
  activeBrush = val - 1

  mousePos.x = mouseX;
  mousePos.y = mouseY;

  image(
    denimImage,
    0,
    0,
    gridRes * gridSize * pixelSize,
    gridRes * gridSize * pixelSize,
    0,
    0,
    (gridRes * gridSize),
    (gridRes * gridSize)
  );

  // image(paintLayer, 0, 0);

  image(
    paintLayer,
    0,
    0,
    canvasSize,
    canvasSize,
    0,
    0,
    (gridRes * gridSize),
    (gridRes * gridSize)
  );


  previewItem(getIndex().x, getIndex().y)

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

const getIndex = () => {
  if (lastItemPainted) {
    console.log(lastItemPainted)
  }

  let limitedMousePos = createVector();
  mousePos.x > canvasSize
    ? (canvasSize)
    : (limitedMousePos.x = mousePos.x);
  mousePos.y > canvasSize
    ? (limitedMousePos.y = canvasSize)
    : (limitedMousePos.y = mousePos.y);


  ////////////////////////////////////////

  let indexes = createVector()

  indexes.x = Math.floor(limitedMousePos.x / gridRes / pixelSize);
  indexes.y = Math.floor(limitedMousePos.y / gridRes / pixelSize);
  // console.log(xIndex, yIndex);

  ////////////////////////////////////////

  return indexes

};

const previewItem = (xIndex, yIndex) => {
  push()
  // translate(mouseX, mouseY)
  translate(xIndex * gridRes * pixelSize,
    yIndex * gridRes* pixelSize)
  // rotate(Math.PI*0.5)
  image(
    brushes[activeBrush],
    0,
    0,
    8 * pixelSize,
    8 * pixelSize,
    0,
    0,
    8, 8
  );
  pop()
}

const paintItem = (xIndex, yIndex) => {
  push()


  paintLayer.copy(
    brushes[activeBrush],
    0,
    0,
    8,
    8,
    xIndex * gridRes,
    yIndex * gridRes,
    gridRes,
    gridRes
  )
  pop()

  lastItemPainted.x = xIndex
  lastItemPainted.y = yIndex
}

const clearPaintLayer = () => {
  console.log('clearPaintLayer')
  // paintLayer = null
  // paintLayer = createGraphics(gridSize * gridRes, gridSize * gridRes);


  paintLayer.clear()

};

let pointerDown = false;
// let canShoot = false;

window.addEventListener("pointerdown", function (event) {
  pointerDown = true;
  // console.log("pointerdown", pointerStartX, pointerStartY);
});

window.addEventListener("pointermove", (event) => {
  if (pointerDown) {
    console.log("doing");

    paintItem(getIndex().x, getIndex().y)
    // previewItem(xIndex, yIndex)
  }
});

window.addEventListener("pointerup", function (event) {
  // console.log("pointerup");

  pointerDown = false;
});
