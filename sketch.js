const dr = [10, 20, 30];
dr.push(10);
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background("black");
}

function draw() {
  translate(-10, -10);
  frameRate(10);
  const inc = 30;
  for (let y = inc; y <= height; y += inc) {
    for (let x = inc; x <= width; x += inc) {
      const diameter = random(dr);
      const randomValue = random(-10, 10);
      if (randomValue < 1) {
        const r = random(0, 255);
        const g = random(0, 255);
        const b = random(0, 255);
        fill(r, g, b);
      } else {
        fill("white");
      }
      noStroke();
      ellipse(x, y, diameter);
    }
  }
}
