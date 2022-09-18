function setup() {
  createCanvas(1450, 750);
  angleMode(DEGREES);
}

function draw() {
  background("yellow");
  stroke("black");
  strokeWeight(15);

  fill("whitesmoke");
  circle(900, 400, 1900);
  fill("blue");
  circle(900, 400, 1700);
  fill("red");
  circle(900, 400, 1500);
  fill("yellow");
  circle(900, 400, 1300);
  fill("whitesmoke");
  circle(900, 400, 1100);

  stroke("black");
  strokeWeight(10);

  fill("whitesmoke");
  circle(1400, 10, 300);
  fill("blue");
  circle(1400, 10, 200);
  fill("red");
  circle(1400, 10, 100);
  fill("yellow");
  circle(1400, 10, 20);

  fill("whitesmoke");
  circle(100, 650, 400);
  fill("blue");
  circle(100, 650, 300);
  fill("red");
  circle(100, 650, 200);
  fill("yellow");
  circle(100, 650, 100);
  fill("whitesmoke");
  circle(100, 650, 30);

  fill("whitesmoke");
  circle(400, 100, 550);
  fill("blue");
  circle(400, 100, 425);
  fill("red");
  circle(400, 100, 300);
  fill("yellow");
  circle(400, 100, 175);
  fill("whitesmoke");
  circle(400, 100, 75);

  stroke("black");
  strokeWeight(15);

  fill("blue");
  circle(900, 400, 900);
  fill("red");
  circle(900, 400, 675);
  fill("yellow");
  circle(900, 400, 450);
  fill("whitesmoke");
  circle(900, 400, 250);

  stroke("black");
  strokeWeight(4);
  fill("red");
  translate(width / 1.65, height / 2.5);
  rotate(frameCount * 3);
  circle(100, 70, 100);

  fill("blue");
  translate(60, 60);
  rotate(frameCount * 1);
  circle(150, 10, 100);

  fill("yellow");
  translate(120, 120);
  rotate(frameCount * 1);
  circle(50, 50, 100);

  fill("whitesmoke");
  translate(200, 200);
  rotate(frameCount * 1);
  circle(40, 40, 100);
}
