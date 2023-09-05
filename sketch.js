const WORLD_SIZE = 4000;
const GRID_SIZE = 25;

const snakes = [];
const pellets = [];
let oldSnakeGrid = {},
  oldPelletGrid = {};
let camPosition, player, playerUsername;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSL);

  camPosition = new Vector2(WORLD_SIZE / 2, WORLD_SIZE / 2);

  playerUsername =
    prompt("What is your name? (Other players will see)", "") || "Player";
}

function windowResized() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  // spawn new pellets
  const pelletGoal = WORLD_SIZE * WORLD_SIZE * 0.00002;
  while (pellets.length < pelletGoal) {
    pellets.push(
      new Pellet(
        new Vector2(
          random(250, WORLD_SIZE - 250),
          random(250, WORLD_SIZE - 250)
        )
      )
    );
  }

  // spawn new snakes
  const snakeGoal = Math.max(3, WORLD_SIZE * WORLD_SIZE * 0.0000005);
  while (snakes.length < snakeGoal) {
    const snake = new AIsnake(
      randomUsername(),
      new Vector2(random(250, WORLD_SIZE + 250), random(250, WORLD_SIZE + 250))
    );
    snake.velocity = Vector2fromMagDir(1, random(TWO_PI));
    snakes.push(snake);
  }

  // spawn new player
  if (player == null || !player.alive) {
    player = new PlayerSnake(
      playerUsername,
      new Vector2(
        random(WORLD_SIZE / 2 - 500, WORLD_SIZE / 2 + 500),
        random(WORLD_SIZE / 2 - 500, WORLD_SIZE / 2 + 500)
      )
    );
    snakes.push(player);
  }

  // update snakes with old snake grid
  for (const snake of snakes)
    snake.update(oldSnakeGrid, oldPelletGrid, GRID_SIZE);

  // make new snakeGrid, keep for next frame
  const snakeGrid = {};
  oldSnakeGrid = snakeGrid;
  for (const snake of snakes) snake.submitNodes(snakeGrid, GRID_SIZE);

  // run snake on snakeGrid collisions
  for (const gridKey in snakeGrid) {
    const gridList = snakeGrid[gridKey];
    for (const snake of snakes) {
      const headNode = snake.firstNode;
      for (let i = 0; i < gridList.length; i++) {
        const otherNode = gridList[i];
        if (otherNode.id === headNode.id && !otherNode.selfCheck) continue;
        if (
          otherNode.position.dist(headNode.position) >
          otherNode.size + headNode.size
        )
          continue;
        snake.alive = false;
      }
    }
  }

  // remove dead snakes
  for (let i = 0; i < snakes.length; i++) {
    if (snakes[i].alive) continue;
    snakes[i].kill();
    snakes.splice(i, 1);
    i--;
  }

  // make pelletGrid, keep for next frame
  const pelletGrid = {};
  oldPelletGrid = pelletGrid;
  for (const pellet of pellets) pellet.submitNodes(pelletGrid, GRID_SIZE);

  // run snake on pelletGrid collisions
  for (const gridKey in pelletGrid) {
    const gridList = pelletGrid[gridKey];
    for (const snake of snakes) {
      const headNode = snake.firstNode;
      for (let i = 0; i < gridList.length; i++) {
        const pelletNode = gridList[i];
        if (
          pelletNode.position.dist(headNode.position) >
          pelletNode.size + headNode.size
        )
          continue;
        snake.size += pelletNode.size / 2;
        pelletNode.alive = false;
      }
    }
  }

  // remove dead pellets
  for (let i = 0; i < pellets.length; i++) {
    if (pellets[i].alive) continue;
    pellets.splice(i, 1);
    i--;
  }

  // control camera
  if (player.alive) {
    camPosition
      .multScalar(9)
      .add(player.positions[0])
      .subScalar(width / 2, height / 2)
      .divScalar(10);
  }

  // draw
  translate(-camPosition.x, -camPosition.y);
  background(0, 100, 40);
  fill(260, 30, 20);
  noStroke();
  rect(0, 0, WORLD_SIZE, WORLD_SIZE);

  for (const pellet of pellets) {
    pellet.draw();
  }
  for (const snake of snakes) {
    snake.draw();
  }
}

class Snake {
  constructor(name, position = new Vector2()) {
    this.name = name;
    this.positions = [position];
    this.velocity = new Vector2(0, -1);
    this.size = 200;
    this.color = color(random(0, 360), 100, 50);
    this.firstNode = null;
    this.alive = true;
    this.id = Symbol();
  }

  draw() {
    strokeWeight(this.nodeSize * 3);
    stroke(this.color);

    const viewBuffer = this.nodeSize * 3 + 10;
    for (let i = 0; i < this.positions.length - 1; i++) {
      const p0 = this.positions[i + 0],
        p1 = this.positions[i + 1];

      if (
        p0.x + viewBuffer < camPosition.x ||
        p0.x - viewBuffer > camPosition.x + width ||
        p0.y + viewBuffer < camPosition.y ||
        p0.y - viewBuffer > camPosition.y + height
      )
        continue;

      line(p0.x, p0.y, p1.x, p1.y);
    }

    const p = this.positions[0];

    strokeWeight(2);
    stroke(0);
    fill(255);
    text(this.name, p.x, p.y - 20);
  }

  update(moveVec) {
    const effectiveSize = Math.min(8, this.nodeSize);
    this.velocity.add(moveVec.norm(2 / effectiveSize));
    this.velocity.multScalar(1 - Math.pow(0.6, effectiveSize));
    if (this.velocity.mag < 1.5) {
      this.velocity.norm(1.5);
    }

    const newPosition = this.positions[0].copy().add(this.velocity);

    if (
      newPosition.x < 0 ||
      newPosition.y < 0 ||
      newPosition.x > WORLD_SIZE ||
      newPosition.y > WORLD_SIZE
    ) {
      this.alive = false;
    }

    this.positions.unshift(newPosition);

    if (random(1) < 0.01) this.size--;

    if (this.size <= 5) this.alive = false;

    while (this.positions.length > this.size) {
      this.positions.pop();
    }
  }

  kill() {
    for (let i = 0; i < this.positions.length; i += 10) {
      pellets.push(new Pellet(this.positions[i + 0]));
    }
  }

  submitNodes(grid, gridSize = 25) {
    const nodeSize = this.nodeSize;
    for (let i = 0; i < this.positions.length; i++) {
      const position = this.positions[i];

      const minX = Math.floor((position.x - nodeSize) / gridSize);
      const minY = Math.floor((position.y - nodeSize) / gridSize);
      const maxX = Math.ceil((position.x + nodeSize) / gridSize);
      const maxY = Math.ceil((position.y + nodeSize) / gridSize);

      for (let x = minX; x < maxX; x++) {
        for (let y = minY; y < maxY; y++) {
          const gridKey = x + "," + y;
          if (grid[gridKey] == null) grid[gridKey] = [];

          const node = {
            position,
            size: nodeSize,
            snake: this,
            selfCheck: (nodeSize * 3) / this.velocity.mag + 0.1 < i,
          };

          grid[gridKey].push(node);
          if (i === 0) this.firstNode = node;
        }
      }
    }
  }

  get nodeSize() {
    return Math.pow(this.size, 1 / 3);
  }
}

class PlayerSnake extends Snake {
  update() {
    const moveVec = new Vector2();

    if (keyIsDown(65) || keyIsDown(37)) moveVec.x -= 1;
    if (keyIsDown(68) || keyIsDown(39)) moveVec.x += 1;
    if (keyIsDown(87) || keyIsDown(38)) moveVec.y -= 1;
    if (keyIsDown(83) || keyIsDown(40)) moveVec.y += 1;

    super.update(moveVec);
  }
}

class AIsnake extends Snake {
  update(snakeGrid, pelletGrid, gridSize) {
    const lookDist = 500;

    if (!this.pathSafe(snakeGrid, gridSize, 0, lookDist)) {
      for (let i = 0.25; i < 3; i += 0.25) {
        if (this.pathSafe(snakeGrid, gridSize, i, lookDist)) {
          this.turn(0.8);
          return;
        }
        if (this.pathSafe(snakeGrid, gridSize, -i, lookDist)) {
          this.turn(-0.8);
          return;
        }
      }
    }

    const seenPellets = [];
    for (let i = -0.5; i <= 0.5; i += 0.1) {
      const pellets = this.cast(
        pelletGrid,
        gridSize,
        i,
        gridSize * 0.05,
        lookDist,
        false
      );
      if (Array.isArray(pellets)) {
        seenPellets.push(...pellets);
      }
    }
    if (seenPellets.length > 0) {
      seenPellets.sort((a, b) => {
        return (
          a.position.dist(this.positions[0]) -
          b.position.dist(this.positions[0])
        );
      });
      this.turn(
        seenPellets[0].position
          .copy()
          .sub(this.positions[0])
          .angleTo(this.velocity) * 5
      );
      return;
    }

    this.turn(0);
  }

  pathSafe(grid, gridSize, angle, lookDist) {
    const jumpCastSize = gridSize * 0.05;

    return (
      !this.cast(grid, gridSize, angle, jumpCastSize, lookDist) &&
      !this.cast(grid, gridSize, angle + 0.1, jumpCastSize, lookDist) &&
      !this.cast(grid, gridSize, angle - 0.1, jumpCastSize, lookDist) &&
      !this.cast(grid, gridSize, angle + 0.2, jumpCastSize, lookDist) &&
      !this.cast(grid, gridSize, angle - 0.2, jumpCastSize, lookDist)
    );
  }

  cast(grid, gridSize, angle, jumpSize, jumpDist, checkForSelf = true) {
    const jump = this.velocity.copy().rotate(angle);
    const castPosition = this.positions[0].copy();
    jump.norm(jumpSize);

    let lastKey;
    for (let i = 0; i < jumpDist; i += jumpSize) {
      const gridKey =
        Math.floor(castPosition.x / gridSize) +
        "," +
        Math.floor(castPosition.y / gridSize);
      if (gridKey !== lastKey) {
        lastKey = gridKey;

        const gridList = grid[gridKey];
        if (gridList != null) {
          if (checkForSelf) {
            for (const node of gridList) {
              if (node.snake.id !== this.id) return gridList;
            }
          } else {
            return gridList;
          }
        }
      }

      castPosition.add(jump);
    }

    if (
      castPosition.x < 0 ||
      castPosition.y < 0 ||
      castPosition.x > WORLD_SIZE ||
      castPosition.y > WORLD_SIZE
    ) {
      return true;
    }

    return false;
  }

  turn(angle) {
    super.update(this.velocity.copy().rotate(angle));
  }
}

class Pellet {
  constructor(position = new Vector2()) {
    this.position = position;
    this.size = (floor(random(3)) + 4) * 2;
    this.color = color(random(0, 360), 100, 50);
    this.alive = true;
    this.moveSeed = Math.random() * 65536;
  }

  draw() {
    if (
      this.position.x + this.size < camPosition.x ||
      this.position.x - this.size > camPosition.x + width ||
      this.position.y + this.size < camPosition.y ||
      this.position.y - this.size > camPosition.y + height
    )
      return;

    noStroke();
    fill(this.color);

    circle(this.position.x, this.position.y, this.size * 2);
  }

  update(moveVec) {
    const time = millis() * 0.01;
    this.position.addScalar(
      noise(this.moveSeed, time),
      noise(this.moveSeed + 8204, time)
    );
  }

  submitNodes(grid, gridSize = 25) {
    const minX = Math.floor((this.position.x - this.size) / gridSize);
    const minY = Math.floor((this.position.y - this.size) / gridSize);
    const maxX = Math.ceil((this.position.x + this.size) / gridSize);
    const maxY = Math.ceil((this.position.y + this.size) / gridSize);

    for (let x = minX; x < maxX; x++) {
      for (let y = minY; y < maxY; y++) {
        const gridKey = x + "," + y;
        if (grid[gridKey] == null) grid[gridKey] = [];

        grid[gridKey].push(this);
      }
    }
  }
}

// author WD_STEVE
// version 3.2.5
// JS only

function Vector2fromObj(obj) {
  return new Vector2(obj.x, obj.y);
}

function Vector2fromMagDir(mag, dir) {
  return new Vector2(mag * Math.cos(dir), mag * Math.sin(dir));
}

function Vector3fromObj(obj) {
  return new Vector3(obj.x, obj.y, obj.z);
}

class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector2(this.x, this.y);
  }

  equal(vec) {
    return this.x === vec.x && this.y === vec.y;
  }

  set(vec) {
    this.x = vec.x;
    this.y = vec.y;
    return this;
  }

  setScalar(x = 0, y = x) {
    this.x = x;
    this.y = y;
    return this;
  }

  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  addScalar(x = 0, y = x) {
    this.x += x;
    this.y += y;
    return this;
  }

  sub(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  subScalar(x = 0, y = x) {
    this.x -= x;
    this.y -= y;
    return this;
  }

  mult(vec) {
    this.x *= vec.x;
    this.y *= vec.y;
    return this;
  }

  multScalar(x = 1, y = x) {
    this.x *= x;
    this.y *= y;
    return this;
  }

  div(vec) {
    this.x /= vec.x;
    this.y /= vec.y;
    return this;
  }

  divScalar(x = 1, y = x) {
    this.x /= x;
    this.y /= y;
    return this;
  }

  rem(vec) {
    this.x %= vec.x;
    this.y %= vec.y;
    return this;
  }

  remScalar(x = 1, y = x) {
    this.x %= x;
    this.y %= y;
    return this;
  }

  mod(vec) {
    this.x = ((this.x % vec.x) + vec.x) % vec.x;
    this.y = ((this.y % vec.y) + vec.y) % vec.y;
    return this;
  }

  modScalar(x = 1, y = x) {
    this.x = ((this.x % x) + x) % x;
    this.y = ((this.y % y) + y) % y;
    return this;
  }

  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }

  mix(vec, amount) {
    this.x = this.x + (vec.x - this.x) * amount;
    this.y = this.y + (vec.y - this.y) * amount;
    return this;
  }

  norm(magnitude = 1) {
    const mag = this.mag;
    if (mag === 0) return this;

    const multiplier = magnitude / mag;

    this.x *= multiplier;
    this.y *= multiplier;
    return this;
  }

  normArea(targetArea = 1) {
    const area = this.area;
    if (area === 0) return this;

    const multiplier = Math.sqrt(targetArea / area);

    this.x *= multiplier;
    this.y *= multiplier;
    return this;
  }

  limit(limit = 1) {
    if (this.mag > limit) this.norm(limit);
    return this;
  }

  setAngle(angle) {
    const mag = this.mag;
    this.x = Math.cos(angle) * mag;
    this.y = Math.sin(angle) * mag;
    return this;
  }

  angleTo(vec) {
    return Math.atan2(vec.y - this.y, vec.x - this.x);
  }

  rotate(angle) {
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    const x = this.x * cosAngle - this.y * sinAngle;
    this.y = this.x * sinAngle + this.y * cosAngle;
    this.x = x;
    return this;
  }

  dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  }

  cross(vec) {
    const top = vec.y * this.x - vec.x - this.y;
    const bottom = this.x * vec.y + this.y * vec.y;
    return Math.atan(top / bottom);
  }

  dist(vec) {
    const resultX = this.x - vec.x,
      resultY = this.y - vec.y;
    return Math.sqrt(resultX * resultX + resultY * resultY);
  }

  distSq(vec) {
    const resultX = this.x - vec.x,
      resultY = this.y - vec.y;
    return resultX * resultX + resultY * resultY;
  }

  get mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get magSq() {
    return this.x * this.x + this.y * this.y;
  }

  set mag(magnitude) {
    this.norm(magnitude);
  }

  get area() {
    return this.x * this.y;
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  set angle(angle) {
    this.setAngle(angle);
  }

  get array() {
    return [this.x, this.y];
  }

  set array(arr) {
    this.x = arr[0];
    this.y = arr[1];
  }
}

class Vector3 {
  constructor(x = 0, y = x, z = y) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  copy() {
    return new Vector3(this.x, this.y, this.z);
  }

  equal(vec) {
    return this.x === vec.x && this.y === vec.y && this.z === vec.z;
  }

  set(vec) {
    this.x = vec.x;
    this.y = vec.y;
    this.z = vec.z;
    return this;
  }

  setScalar(x = 0, y = x, z = y) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
    return this;
  }

  addScalar(x = 0, y = x, z = y) {
    this.x += x;
    this.y += y;
    this.z += z;
    return this;
  }

  sub(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;
    return this;
  }

  subScalar(x = 0, y = x, z = y) {
    this.x -= x;
    this.y -= y;
    this.z -= z;
    return this;
  }

  mult(vec) {
    this.x *= vec.x;
    this.y *= vec.y;
    this.z *= vec.z;
    return this;
  }

  multScalar(x = 1, y = x, z = y) {
    this.x *= x;
    this.y *= y;
    this.z *= z;
    return this;
  }

  div(vec) {
    this.x /= vec.x;
    this.y /= vec.y;
    this.z /= vec.z;
    return this;
  }

  divScalar(x = 1, y = x, z = y) {
    this.x /= x;
    this.y /= y;
    this.z /= z;
    return this;
  }

  rem(vec) {
    this.x %= vec.x;
    this.y %= vec.y;
    this.z %= vec.z;
    return this;
  }

  remScalar(x = 1, y = x, z = y) {
    this.x %= x;
    this.y %= y;
    this.z %= z;
    return this;
  }

  mod(vec) {
    this.x = ((this.x % vec.x) + vec.x) % vec.x;
    this.y = ((this.y % vec.y) + vec.y) % vec.y;
    this.z = ((this.z % vec.z) + vec.z) % vec.z;
    return this;
  }

  modScalar(x = 1, y = x, z = y) {
    this.x = ((this.x % x) + x) % x;
    this.y = ((this.y % y) + y) % y;
    this.z = ((this.z % z) + z) % z;
    return this;
  }

  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);
    return this;
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    return this;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }

  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    return this;
  }

  mix(vec, amount) {
    this.x = this.x + (vec.x - this.x) * amount;
    this.y = this.y + (vec.y - this.y) * amount;
    this.z = this.z + (vec.y - this.z) * amount;
    return this;
  }

  norm(magnitude = 1) {
    const mag = this.mag;
    if (mag === 0) return this;

    const multiplier = magnitude / mag;

    this.x *= multiplier;
    this.y *= multiplier;
    this.z *= multiplier;
    return this;
  }

  limit(limit = 1) {
    if (this.mag > limit) this.norm(limit);
    return this;
  }

  dot(vec) {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  }

  cross(vec) {
    this.x = this.y * vec.z - this.z * vec.y;
    this.y = this.z * vec.x - this.x * vec.z;
    this.z = this.x * vec.y - this.y * vec.x;

    return this;
  }

  dist(vec) {
    const resultX = this.x - vec.x,
      resultY = this.y - vec.y,
      resultZ = this.z - vec.z;
    return Math.sqrt(resultX * resultX + resultY * resultY + resultZ * resultZ);
  }

  distSq(vec) {
    const resultX = this.x - vec.x,
      resultY = this.y - vec.y,
      resultZ = this.z - vec.z;
    return resultX * resultX + resultY * resultY + resultZ * resultZ;
  }

  get xy() {
    return new Vector2(this.x, this.y);
  }

  get yx() {
    return new Vector2(this.y, this.x);
  }

  get yz() {
    return new Vector2(this.y, this.z);
  }

  get zy() {
    return new Vector2(this.z, this.y);
  }

  get xz() {
    return new Vector2(this.x, this.z);
  }

  get zx() {
    return new Vector2(this.z, this.x);
  }

  get xyz() {
    return new Vector3(this.x, this.y, this.z);
  }

  get yxz() {
    return new Vector3(this.y, this.x, this.z);
  }

  get yzx() {
    return new Vector3(this.y, this.z, this.x);
  }

  get zyx() {
    return new Vector3(this.z, this.y, this.x);
  }

  get xzy() {
    return new Vector3(this.x, this.z, this.y);
  }

  get zxy() {
    return new Vector3(this.z, this.x, this.y);
  }

  get mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  get magSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  set mag(magnitude) {
    this.norm(magnitude);
  }

  get array() {
    return [this.x, this.y, this.z];
  }

  set array(arr) {
    this.x = arr[0];
    this.y = arr[1];
    this.z = arr[1];
  }
}

const usernames = `shaquille.oatmeal
WD_STEVE
Donkay
earth
wind
fire
Light
hanging_with_my_gnomies
hoosier-daddy
fast_and_the_curious
averagestudent
BadKarma
google_was_my_idea
cute.as.ducks
casanova
real_name_hidden
HairyPoppins
fedora_the_explorer 
OP_rah
YellowSnowman
Joe Not Exotic
proposaldew
headscarfcravat
cornertrusty
bastardsalmon
stormcapital
sandalsastronomer
cavalcadeshade
pearpackage
JAMES
JOHN
ROBERT
MICHAEL
WILLIAM
DAVID
RICHARD
CHARLES
JOSEPH
THOMAS
CHRISTOPHER
DANIEL
PAUL
MARK
savingshoneycomb
plopresolution
cinnamonarab
shamrockplayer
paverrebuff
sellvapor
todayhoop
sailboatweekend
schoolglands
joblessbegan
pussfacelemur
lollipopgnu
multipleslurp
gunnetwork
abaftinspire
citizenbimbo
gapingwindbag
sulkydemocracy
magicheavy
fishmillion
absurdadvice
chatterboxtrite
rightwhereas
utilizedcluck
postplains
snobsurfer
petulantweeping`.split("\n");

function randomUsername() {
  return usernames[floor(random(usernames.length))];
}
