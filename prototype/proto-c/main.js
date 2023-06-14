let radio;

function preload() {
  base = loadImage("./assets/base.png");
  layerA = loadImage("./assets/layerA.png");
  layerB = loadImage("./assets/layerB.png");
}

function setup() {
  pixelDensity(1);

  let canvasRes;
  windowWidth > 540 ? (canvasRes = 540) : (canvasRes = windowWidth);

  var myCanvas = createCanvas(canvasRes, canvasRes);
  myCanvas.parent("p5js");

  loadPixels();

  image(base, 0, 0);



  button = createButton("save me");
  // button.position(0, 0);
  button.mousePressed(saveImage);
  button.parent('controls-container')

  radio = createRadio();
  radio.option("1", "layerA");
  radio.option("2", "layerB");
  radio.option("3", "Cancella");
  // radio.style('width', '30px');
  radio.selected("1");
  radio.parent('controls-container')
}

function draw() {
  // background(220);
  let val = radio.value();
  console.log(val);

  if (touchMoved && mouseIsPressed) {
    if (val == 1) {
      let portionA = layerA.get(mouseX, mouseY, 50, 50);
      image(portionA, mouseX, mouseY, 50, 50);
    } else if (val == 2) {
      let portionA = layerB.get(mouseX, mouseY, 50, 50);
      image(portionA, mouseX, mouseY, 50, 50);
    } else if (val == 3) {
      let portionA = base.get(mouseX, mouseY, 50, 50);
      image(portionA, mouseX, mouseY, 50, 50);
    }
  }

  //  for (var i = 0; i < touches.length; i++) {
  //     ellipse(touches[i].x, touches[i].y, 100, 50);
  // }
}

function touchMoved(event) {
  // ellipse(mouseX, mouseY, 5, 5);
  // prevent default
  return false;
}

function saveImage() {
  save("yuhuu.jpg");
}
