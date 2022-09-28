const dr = [10, 20, 30];
dr.push(10);
let noiseVal;
let noiseScale = 0.02;
function setup() {
  createCanvas(windowWidth, windowHeight);
  noiseSeed(99);
  stroke(0, 10);
  background("white");
}

function draw() {
  for (let y1 = 0; y1 < height; y1++) {
    for (let x1 = 0; x1 < width; x1++) {
      noiseDetail(2, 0.2);
      noiseVal = noise(x1 * noiseScale, y1 * noiseScale);
      stroke(noiseVal * 255);
      point(x1, y1);
    }
  }
  frameRate(150);
  const inc = 50;
  for (let y = inc; y < height; y += inc) {
    for (let x = inc; x < width; x += inc) {
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
      ellipse(random(x), random(y), diameter);
    }
  }
}
