function preload() {
  // put preload code here
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // put setup code here
  angleMode(DEGREES);
  background("whitesmoke");
}

function draw() {
  // put drawing code here
   stroke("black");
  strokeWeight(15);
  fill("blue");
  circle(245, 125, 650);
  fill("red");
  circle(245, 125, 475);
  fill("yellow");
  circle(245, 125, 300);
  fill("whitesmoke");
  circle(245, 125, 150);

  stroke("black");
  strokeWeight(2);
  fill("red");
  translate(width / 1.65, height / 3.1);
  rotate(frameCount * 3);
  circle(100, 70, 70);

  fill("blue");
  translate(30, 40);
  rotate(frameCount * 1);
  circle(150, 10, 70);

  fill("yellow");
  translate(120, 120);
  rotate(frameCount * 1);
  circle(50, 50, 70);
}
