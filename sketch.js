const dr = [20, 30, 40];
dr.push(10);
let noiseScale = 0.015;
function setup() {
  createCanvas(windowsWidth,windowHeight);
  noiseSeed(80);
  stroke(0);
  background("black");
}

function draw() {
  frameRate(20);
  for (let y1 = 0; y1 < height; y1++) {
    for (let x1 = 0; x1 < width; x1++) {
      noiseDetail(10, 0.3);
      noiseVal = noise(x1 * noiseScale, y1 * noiseScale);
      stroke(noiseVal * 255);
      point(x1, y1);
    }
  }
  const inc = 100;
  for (let y = inc; y < height; y += inc) {
    for (let x = inc; x < width; x += inc) {
      const diameter = random(dr);
      const randomValue = random();
      if (randomValue < 0.4) {
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
