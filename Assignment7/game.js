const dot = (a, b) => {
  if (a.length !== b.length) {
    console.error("Invalid dot product");
  }

  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
};

const cross = (a, b) => {
  if (a.length !== b.length || a.length !== 3) {
    console.error("Invalid cross product");
  }

  return [
    a[1] * b[2] - a[2] * b[1],
    -(a[0] * b[2] - a[2] * b[0]),
    a[0] * b[1] - a[1] * b[0],
  ];
};

const sadd = (k, a) => {
  return a.map((n) => n + k);
};

const smult = (k, a) => {
  return a.map((n) => n * k);
};

const toMatrix = (a) => {
  if (typeof a[0] === "number") {
    return a.map((n) => [n]);
  }
  return a;
};

const add = (a, b) => {
  a = toMatrix(a);
  b = toMatrix(b);

  if (a.length !== b.length || a[0].length !== b[0].length) {
    console.error("Invalid addition");
  }

  const copy = new Array(a.length);
  for (let i = 0; i < a.length; i++) {
    copy[i] = new Array(a[0].length);
    for (let j = 0; j < a[0].length; j++) {
      copy[i][j] = a[i][j] + b[i][j];
    }
  }
  return copy;
};

const sub = (a, b) => {
  a = toMatrix(a);
  b = toMatrix(b);

  if (a.length !== b.length || a[0].length !== b[0].length) {
    console.error("Invalid subtraction");
  }

  const copy = new Array(a.length);
  for (let i = 0; i < a.length; i++) {
    copy[i] = new Array(a[0].length);
    for (let j = 0; j < a[0].length; j++) {
      copy[i][j] = a[i][j] - b[i][j];
    }
  }
  return copy;
};

// Elementwise multiplication
const emult = (a, b) => {
  a = toMatrix(a);
  b = toMatrix(b);

  if (a.length !== b.length || a[0].length !== b[0].length) {
    console.error("Invalid elementwise multiplication");
  }

  const copy = new Array(a.length);
  for (let i = 0; i < a.length; i++) {
    copy[i] = new Array(a[0].length);
    for (let j = 0; j < a[0].length; j++) {
      copy[i][j] = a[i][j] * b[i][j];
    }
  }
  return copy;
};

const len = (a) => {
  return Math.sqrt(dot(a, a));
};

const norm = (a) => {
  return smult(1 / len(a), a);
};

const refl = (a, normal) => {
  return add(smult(2 * dot(norm(normal), a), norm(normal)), smult(-1, a));
};

const randomInBounds = (min, max) => {
  return Math.random() * (max - min) + min;
};

const distance = (position1, position2) => {
  const xDiff = position1.x - position2.x;
  const yDiff = position1.y - position2.y;
  const zDiff = position1.z - position2.z;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff + zDiff * zDiff);
};

const GameState = {
  ACTIVE: "ACTIVE",
  WIN: "WIN",
};

class Game {
  constructor() {
    this.state = GameState.ACTIVE;
    this.time = 0;
    this.targets = [];
    for (let i = 0; i < 30; i++) {
      const activateAt = Math.floor(10 * (i + 1) + randomInBounds(-5, 5));
      this.targets.push(
        new Target(
          new Vector3(
            randomInBounds(-5, 5),
            randomInBounds(4, 6),
            randomInBounds(1, 2)
          ),
          randomInBounds(1, 3),
          activateAt,
          Math.floor(activateAt + 15)
        )
      );
    }
    this.bullets = [];
  }

  update() {
    if (this.state !== GameState.ACTIVE) {
      return;
    }
    this.time++;
    // console.log(this.time);
    this.targets.forEach((target) => target.update(this.time));
    this.bullets.forEach((bullet) => bullet.update());
    // Remove any expired bullets
    this.bullets = this.bullets.filter((bullet) => bullet.expireAt > this.time);
    // Deal with collisions between bullets and targets
    this.bullets.forEach((bullet) => {
      this.targets
        .filter((target) => target.state === TargetState.ACTIVE)
        .forEach((target) => {
          if (
            distance(bullet.position, target.position) <=
            bullet.size + target.size
          ) {
            target.state = TargetState.HIT;
          }
        });
    });

    if (
      this.targets.filter(
        (target) =>
          target.state === TargetState.ACTIVE ||
          target.state === TargetState.INACTIVE
      ).length === 0
    ) {
      this.state = GameState.WIN;
    }
  }

  fireBullet(position, velocity) {
    if (this.state !== GameState.ACTIVE) {
      return;
    }
    this.bullets.push(new Bullet(position, 1, velocity, this.time + 30));
  }

  getScore() {
    return this.targets
      .map((target) => target.state === TargetState.HIT)
      .reduce((a, b) => a + b);
  }
}

const TargetState = {
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
  HIT: "HIT",
  EXPIRED: "EXPIRED",
};

class Target {
  constructor(position, size, activateAt, expireAt) {
    this.position = position;
    this.size = size;
    this.state = TargetState.INACTIVE;
    this.activateAt = activateAt;
    this.expireAt = expireAt;
  }

  update(time) {
    if (this.state === TargetState.INACTIVE && this.activateAt <= time) {
      this.state = TargetState.ACTIVE;
    }
    if (this.state === TargetState.ACTIVE && this.expireAt <= time) {
      this.state = TargetState.EXPIRED;
    }
  }
}

class Bullet {
  constructor(position, size, velocity, expireAt) {
    this.position = position;
    this.size = size;
    this.velocity = velocity;
    this.expireAt = expireAt;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;
  }
}

class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}