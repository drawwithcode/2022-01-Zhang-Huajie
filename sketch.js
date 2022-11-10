////////////////////////////////////////////
//Global Variable
////////////////////////////////////////////
var objs = [];
var btns = [];
var FPS = 60;
var timepast = 0;
var R = 200;
var G = 150;
var B = 50;
var bR = 0;
var bG = 0;
var bB = 50;
var eraserRange = 20;
var timerRange = 50;
var brushType = "CIRCLE";
var pbrushType = "CIRCLE";
var isPlaying = true;
var isMenuHide = false;

////////////////////////////////////////////
//FunctionButton
////////////////////////////////////////////
function FuncBtn(X, Y, W, H, CMD) {
  this.x = X;
  this.y = Y;
  this.w = W;
  this.h = H;
  this.cmd = CMD;
}
FuncBtn.prototype.isMouseInBtn = function () {
  if (
    mouseX >= this.x &&
    mouseX <= this.x + this.w &&
    mouseY >= this.y &&
    mouseY <= this.y + this.h
  ) {
    return true;
  } else {
    return false;
  }
};
FuncBtn.prototype.clickBtn = function () {
  print("ClickBtn!");
  if (this.cmd == "sun") {
    bR = 200;
    bG = 255;
    bB = 255;
    this.cmd = "moon";
  } else if (this.cmd == "moon") {
    bR = 0;
    bG = 0;
    bB = 50;
    this.cmd = "sun";
  } else if (this.cmd == "pause") {
    isPlaying = false;
    for (var i = 0; i < objs.length; i++) {
      objs[i].isPlaying = false;
    }
    this.cmd = "play";
  } else if (this.cmd == "play") {
    isPlaying = true;
    for (var i = 0; i < objs.length; i++) {
      objs[i].isPlaying = true;
    }
    this.cmd = "pause";
  } else if (this.cmd == "timer") {
    brushType = "TIMER";
  } else if (this.cmd == "eraser") {
    brushType = "ERASER";
  } else if (this.cmd == "clear") {
    objs = [];
  } else if (this.cmd == "save") {
    saveCanvas("Painting", "png");
  } else if (this.cmd == "circle") {
    brushType = "TRIANGLE";
    pbrushType = "CIRCLE";
    this.cmd = "triangle";
  } else if (this.cmd == "triangle") {
    brushType = "LINES";
    pbrushType = "TRIANGLE";
    this.cmd = "lines";
  } else if (this.cmd == "lines") {
    brushType = "CIRCLE";
    pbrushType = "LINES";
    this.cmd = "circle";
  }
};

FuncBtn.prototype.displayBtn = function () {
  stroke(0);
  strokeWeight(1);
  fill(255, 255, 255);
  rect(this.x, this.y, this.w, this.h, 5);

  if (this.cmd == "sun") {
    fill(255, 50, 50);
    translate(this.x + this.w / 2, this.y + this.h / 2);
    for (var i = 0; i < 8; i++) {
      rotate(PI / 4.0);
      line(0, 0, 8, 8);
    }
    resetMatrix();
    ellipse(this.x + this.w / 2, this.y + this.h / 2, 15, 15);
  } else if (this.cmd == "moon") {
    fill(255, 255, 50);
    translate(this.x + this.w / 2, this.y + this.h / 2);
    arc(-5, 0, 25, 25, PI + HALF_PI, HALF_PI, CHORD);
    resetMatrix();
  } else if (this.cmd == "pause") {
    fill(0);
    translate(this.x + this.w / 2, this.y + this.h / 2);
    rectMode(CENTER);
    rect(-4, 0, 4, 15);
    rect(4, 0, 4, 15);
    rectMode(CORNER);
    resetMatrix();
  } else if (this.cmd == "play") {
    fill(0);
    translate(this.x + this.w / 2, this.y + this.h / 2);
    triangle(-2, -8, -2, 8, 6, 0);
    resetMatrix();
  } else if (this.cmd == "timer") {
    translate(this.x + this.w / 2, this.y + this.h / 2);
    noFill();
    ellipse(0, 0, 22, 22);
    ellipse(0, 0, 25, 25);
    fill(0);
    ellipse(0, 0, 3, 3);
    strokeWeight(2);
    line(0, 0, 5, 0);
    line(0, 0, 0, -7);
    resetMatrix();
  } else if (this.cmd == "eraser") {
    fill(0);
    noStroke();
    translate(this.x + this.w / 2, this.y + this.h / 2);
    textSize(25);
    textAlign(CENTER);
    textStyle(BOLD);
    text("E", 0, 8);
    resetMatrix();
  } else if (this.cmd == "clear") {
    fill(0);
    noStroke();
    translate(this.x + this.w / 2, this.y + this.h / 2);
    textSize(25);
    textAlign(CENTER);
    textStyle(BOLD);
    text("C", 0, 8);
    resetMatrix();
  } else if (this.cmd == "save") {
    fill(0);
    noStroke();
    translate(this.x + this.w / 2, this.y + this.h / 2);
    textSize(25);
    textAlign(CENTER);
    textStyle(BOLD);
    text("S", 0, 8);
    resetMatrix();
  } else if (this.cmd == "circle") {
    fill(0);
    translate(this.x + this.w / 2, this.y + this.h / 2);
    ellipse(6, -2, 10, 10);
    ellipse(-5, -5, 5, 5);
    ellipse(3, 8, 4, 4);
    resetMatrix();
  } else if (this.cmd == "triangle") {
    fill(0);
    translate(this.x + this.w / 2, this.y + this.h / 2);
    triangle(0, 0, 10, 0, 5, -8);
    triangle(-5, 8, 5, 8, 0, 0);
    triangle(-8, -5, -3, -5, -5.5, -9);
    resetMatrix();
  } else if (this.cmd == "lines") {
    fill(0);
    strokeWeight(2);
    translate(this.x + this.w / 2, this.y + this.h / 2);
    line(-5, -10, 5, 0);
    line(-10, -10, 10, 10);
    line(-5, 0, 5, 10);
    resetMatrix();
  }
};

////////////////////////////////////////////
//ColorButton
////////////////////////////////////////////
function ColorBtn(X, Y, W, H, givenR, givenG, givenB) {
  this.x = X;
  this.y = Y;
  this.w = W;
  this.h = H;
  this.r = givenR;
  this.g = givenG;
  this.b = givenB;
}
ColorBtn.prototype.isMouseInBtn = function () {
  if (
    mouseX >= this.x &&
    mouseX <= this.x + this.w &&
    mouseY >= this.y &&
    mouseY <= this.y + this.h
  ) {
    return true;
  } else {
    return false;
  }
};
ColorBtn.prototype.clickBtn = function () {
  R = this.r;
  G = this.g;
  B = this.b;
  if (brushType == "ERASER" || brushType == "TIMER") {
    brushType = pbrushType;
  }
};
ColorBtn.prototype.displayBtn = function () {
  stroke(0);
  strokeWeight(1);
  fill(this.r * 1.5, this.g * 1.5, this.b * 1.5);
  rect(this.x, this.y, this.w, this.h, 5);
};

////////////////////////////////////////////
//Node
////////////////////////////////////////////
function Node(position, givenSize, givenR, givenG, givenB) {
  this.R = givenR;
  this.G = givenG;
  this.B = givenB;
  this.position = createVector(position.x, position.y);
  this.position.x += random(20) - 10;
  this.position.y += random(20) - 10;
  this.size = createVector(0, 0);
  this.sizeScale = 0.5;
  var randomSize = givenSize / 2 + random(10);
  this.baseSize = createVector(randomSize, randomSize);
  this.timepast = 0;
  this.isPlaying = isPlaying;
  this.rotateAngle = random(2 * PI);
  this.shapeType = brushType;
  this.pmouseX = pmouseX;
  this.pmouseY = pmouseY;
  this.mouseX = mouseX;
  this.mouseY = mouseY;
}
Node.prototype.drawing = function () {
  noStroke();
  if (this.shapeType == "CIRCLE") {
    translate(this.position.x, this.position.y);
    fill(
      (this.size.x * this.R) / 10,
      (this.size.x * this.G) / 10,
      (this.size.x * this.B) / 10,
      round(sin(this.timepast) * 128)
    );
    ellipse(
      sin(this.timepast) * this.baseSize.x,
      cos(this.timepast) * this.baseSize.y,
      this.size.x * 1.25,
      this.size.y * 1.25
    );
    fill(
      (this.size.x * this.R) / 10,
      (this.size.x * this.G) / 10,
      (this.size.x * this.B) / 10,
      255
    );
    ellipse(
      sin(this.timepast) * this.baseSize.x,
      cos(this.timepast) * this.baseSize.y,
      this.size.x,
      this.size.y
    );
    resetMatrix();
  } else if (this.shapeType == "TRIANGLE") {
    translate(this.position.x, this.position.y);
    rotate(this.rotateAngle);
    fill(
      (this.size.x * this.R) / 10,
      (this.size.x * this.G) / 10,
      (this.size.x * this.B) / 10,
      round(sin(this.timepast) * 128)
    );
    triangle(
      sin(this.timepast) * this.baseSize.x - this.size.x * 1.5 * 0.5,
      cos(this.timepast) * this.baseSize.y - this.size.y * 1.5 * 0.5,

      sin(this.timepast) * this.baseSize.x + this.size.x * 1.5 * 0.5,
      cos(this.timepast) * this.baseSize.y - this.size.y * 1.5 * 0.5,

      sin(this.timepast) * this.baseSize.x * 0.5,
      cos(this.timepast) * this.baseSize.y + this.size.y * 1.5 * 0.9 * 0.5
    );

    fill(
      (this.size.x * this.R) / 10,
      (this.size.x * this.G) / 10,
      (this.size.x * this.B) / 10,
      255
    );
    triangle(
      sin(this.timepast) * this.baseSize.x - this.size.x * 0.5,
      cos(this.timepast) * this.baseSize.y - this.size.y * 0.5,

      sin(this.timepast) * this.baseSize.x + this.size.x * 0.5,
      cos(this.timepast) * this.baseSize.y - this.size.y * 0.5,

      sin(this.timepast) * this.baseSize.x * 0.5,
      cos(this.timepast) * this.baseSize.y + this.size.y * 0.9 * 0.5
    );
    resetMatrix();
  } else if (this.shapeType == "LINES") {
    //translate(this.position.x,this.position.y);
    // rotate(this.rotateAngle);

    strokeWeight(2 + (this.size.x / 1.5) * 0.75);
    stroke(
      (this.size.x * this.R) / 8,
      (this.size.x * this.G) / 8,
      (this.size.x * this.B) / 8,
      round(sin(this.timepast) * 128)
    );
    line(this.pmouseX, this.pmouseY, this.mouseX, this.mouseY);
    strokeWeight(1.5 + (this.size.x / 1.5) * 0.5);
    stroke(
      (this.size.x * this.R) / 8,
      (this.size.x * this.G) / 8,
      (this.size.x * this.B) / 8,
      255
    );
    line(this.pmouseX, this.pmouseY, this.mouseX, this.mouseY);

    //resetMatrix();
  }
};
Node.prototype.update = function () {
  this.size = createVector(
    this.baseSize.x + sin(this.timepast) * this.baseSize.x * this.sizeScale,
    this.baseSize.y + sin(this.timepast) * this.baseSize.y * this.sizeScale
  );
  if (this.isPlaying) {
    this.timepast += 1 / FPS;
  }
};

////////////////////////////////////////////
//Setup
////////////////////////////////////////////

function setup() {
  frameRate(FPS);
  createCanvas(600, 600);
  noCursor();
  strokeCap(PROJECT);
  //======================
  //ButtonList
  //======================
  //Color Buttons
  btns.push(new ColorBtn(5, 5 + 30 * 0, 30, 30, 200, 50, 50));
  btns.push(new ColorBtn(5, 5 + 30 * 1, 30, 30, 200, 100, 50));
  btns.push(new ColorBtn(5, 5 + 30 * 2, 30, 30, 200, 150, 50));

  btns.push(new ColorBtn(5, 5 + 30 * 3, 30, 30, 150, 200, 50));
  btns.push(new ColorBtn(5, 5 + 30 * 4, 30, 30, 100, 200, 50));
  btns.push(new ColorBtn(5, 5 + 30 * 5, 30, 30, 50, 200, 50));

  btns.push(new ColorBtn(5, 5 + 30 * 6, 30, 30, 50, 150, 200));
  btns.push(new ColorBtn(5, 5 + 30 * 7, 30, 30, 50, 100, 200));
  btns.push(new ColorBtn(5, 5 + 30 * 8, 30, 30, 50, 50, 200));

  btns.push(new ColorBtn(5, 5 + 30 * 9, 30, 30, 100, 50, 200));
  btns.push(new ColorBtn(5, 5 + 30 * 10, 30, 30, 150, 50, 200));
  btns.push(new ColorBtn(5, 5 + 30 * 11, 30, 30, 200, 50, 200));

  //Function Buttons
  btns.push(new FuncBtn(5, 5 + 30 * 12, 30, 30, "sun"));
  btns.push(new FuncBtn(5, 5 + 30 * 13, 30, 30, "circle"));
  if (isPlaying) {
    btns.push(new FuncBtn(5, 5 + 30 * 14, 30, 30, "pause"));
  } else {
    btns.push(new FuncBtn(5, 5 + 30 * 14, 30, 30, "play"));
  }
  btns.push(new FuncBtn(5, 5 + 30 * 15, 30, 30, "timer"));
  btns.push(new FuncBtn(5, 5 + 30 * 16, 30, 30, "eraser"));
  btns.push(new FuncBtn(5, 5 + 30 * 17, 30, 30, "clear"));
  btns.push(new FuncBtn(5, 5 + 30 * 18, 30, 30, "save"));
}

////////////////////////////////////////////
//Draw
////////////////////////////////////////////
function draw() {
  background(bR, bG, bB);

  //===================
  //Drawing Something
  //===================
  if (mouseIsPressed && (mouseX > 40 || isMenuHide)) {
    if (
      brushType == "CIRCLE" ||
      brushType == "LINES" ||
      brushType == "TRIANGLE"
    ) {
      var position = createVector(mouseX, mouseY);
      objs.push(
        new Node(
          position,
          sqrt(sq(mouseX - pmouseX) + sq(mouseY - pmouseY)),
          R,
          G,
          B
        )
      );
    }
    //Eraser
    else if (brushType == "ERASER" && objs.length > 0) {
      for (var i = 0; i < objs.length; i++) {
        if (
          sqrt(
            sq(objs[i].position.x - mouseX) + sq(objs[i].position.y - mouseY)
          ) <= eraserRange
        ) {
          objs.splice(i, 1);
          break;
        }
      }
    } else if (brushType == "TIMER" && objs.length > 0) {
      for (var i = 0; i < objs.length; i++) {
        if (
          sqrt(
            sq(objs[i].position.x - mouseX) + sq(objs[i].position.y - mouseY)
          ) <= timerRange
        ) {
          objs[i].timepast += 2 / FPS;
          objs[i].isPlaying = false;
        }
      }
    }
  }
  for (var i = 0; i < objs.length; i++) {
    objs[i].drawing();
    objs[i].update();
  }

  //=======================
  //Cursor Icon
  //=======================
  //Menu
  stroke(0);
  strokeWeight(2);
  if (!isMenuHide) {
    for (var i = 0; i < btns.length; i++) {
      btns[i].displayBtn();
      if (btns[i].isMouseInBtn()) {
        cursor(HAND);
      }
    }
  }

  //Canvas
  if (mouseX > 40 || isMenuHide) {
    noCursor();
    fill(R * 1.5, G * 1.5, B * 1.5);
    stroke(R * 1.5, G * 1.5, B * 1.5);
    if (brushType == "CIRCLE") {
      ellipse(mouseX, mouseY, 10, 10);
    } else if (brushType == "TRIANGLE") {
      triangle(
        mouseX - 5,
        mouseY + 3,
        mouseX + 5,
        mouseY + 3,
        mouseX,
        mouseY - 5
      );
    } else if (brushType == "LINES") {
      translate(mouseX, mouseY);
      noFill();
      stroke(255 - bR);
      ellipse(0, 0, 20, 20);
      fill(R * 1.5, G * 1.5, B * 1.5);
      noStroke();
      ellipse(0, 0, 6, 6);
      resetMatrix();
    } else if (brushType == "ERASER") {
      translate(mouseX, mouseY);
      noFill();
      stroke(255 - bR);
      ellipse(0, 0, eraserRange, eraserRange);
      resetMatrix();
    } else if (brushType == "TIMER") {
      translate(mouseX, mouseY);
      stroke(255 - bR);
      noFill();
      ellipse(0, 0, timerRange, timerRange);
      ellipse(0, 0, 22, 22);
      ellipse(0, 0, 25, 25);
      fill(255 - bR);
      ellipse(0, 0, 3, 3);
      strokeWeight(2);
      line(0, 0, 5, 0);
      line(0, 0, 0, -7);
      resetMatrix();
    }
  }
}

function mouseClicked() {
  if (!isMenuHide) {
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].isMouseInBtn()) {
        btns[i].clickBtn();
      }
    }
  }
  return false;
}
