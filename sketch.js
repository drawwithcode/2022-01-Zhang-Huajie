function setup() {
  createCanvas(1450, 750);
  angleMode(DEGREES);
}

function draw() {
   background("smokewhite");
  stroke("black");
  strokeWeight(15);
  let myColor = lerpColor(color("whitesmoke"), color("blue"), frameCount / 240);
  let myColor1 = lerpColor(color("whitesmoke"), color("red"), frameCount / 240);
  let myColor2 = lerpColor(
    color("whitesmoke"),
    color("yellow"),
    frameCount / 240
  );

  fill(myColor2);
  circle(900, 400, 2100);
  fill("whitesmoke");
  circle(900, 400, 1900);
  fill(myColor);
  circle(900, 400, 1700);
  fill(myColor1);
  circle(900, 400, 1500);
  fill(myColor2);
  circle(900, 400, 1300);
  fill("whitesmoke");
  circle(900, 400, 1100);

  stroke("black");
  strokeWeight(10);

  fill("whitesmoke");
  circle(1400, 10, 300);
  fill(myColor);
  circle(1400, 10, 200);
  fill(myColor1);
  circle(1400, 10, 100);
  fill(myColor2);
  circle(1400, 10, 20);

  fill("whitesmoke");
  circle(100, 650, 400);
  fill(myColor);
  circle(100, 650, 300);
  fill(myColor1);
  circle(100, 650, 200);
  fill(myColor2);
  circle(100, 650, 100);
  fill("whitesmoke");
  circle(100, 650, 30);

  fill("whitesmoke");
  circle(400, 100, 550);
  fill(myColor);
  circle(400, 100, 425);
  fill(myColor1);
  circle(400, 100, 300);
  fill(myColor2);
  circle(400, 100, 175);
  fill("whitesmoke");
  circle(400, 100, 75);

  stroke("black");
  strokeWeight(15);

  fill(myColor);
  circle(900, 400, 900);
  fill(myColor1);
  circle(900, 400, 675);
  fill(myColor2);
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
