//FileName:		model.js
//Programmer:	Dan Cliburn, Dean S., Chris C., Chris S.
//Date:			8/11/2020
//Purpose:		This file defines the code for our WebGL 2 model
//The "model" is all of the WebGL2 code that draws our graphics scene

//these variables can be accessed in any function
let gl;
let program;
let gameModel;
//These are used to access uniform variables in the shaders
let offsetXLoc, offsetYLoc;
// Vertex buffers
let playerFaceVertBuffer,
  monsterFaceVertBuffer,
  leftEyeVertBuffer,
  rightEyeVertBuffer,
  smileVertBuffer,
  frownVertBuffer,
  coinVertBuffer,
  gridVertBuffer,
  winTextVertBuffer,
  loseTextVertBuffer;
// Vertex counts
let playerFaceVertCount,
  monsterFaceVertCount,
  leftEyeVertCount,
  rightEyeVertCount,
  smileVertCount,
  frownVertCount,
  coinVertCount,
  gridVertCount,
  winTextVertCount,
  loseTextVertCount;

//Given a canvas element, return the WebGL2 context
//This function is defined in section "Architecture Updates" of the textbook
function getGLContext(canvas) {
  return (
    canvas.getContext("webgl2") ||
    console.error("WebGL2 is not available in your browser.")
  );
}

//Given an id, extract the content's of a shader script from the DOM and return the compiled shader
//This function is defined in section "Time for Action: Rendering a Square" of the textbook
function getShader(id) {
  const script = document.getElementById(id);
  const shaderString = script.text.trim();

  // Assign shader depending on the type of shader
  let shader;
  if (script.type === "shader.vert") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else if (script.type === "shader.frag") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else {
    return null;
  }
  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);
  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

//Create a program with the appropriate vertex and fragment shaders
//This function is defined in section "Time for Action: Rendering a Square" of the textbook
function initProgram() {
  const vertexShader = getShader("vertex-shader");
  const fragmentShader = getShader("fragment-shader");

  // Create a program
  program = gl.createProgram();

  // Attach the shaders to this program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Could not initialize shaders");
  }
  // Use this program instance
  gl.useProgram(program);
}

//Set up the buffers we need to use for rendering
//This function is similar to what is defined in the section "Time for Action: Rendering a Square" of the textbook
function initBuffers() {
  let playerFaceVert = [];
  let monsterFaceVert = [];
  let leftEyeVert = [];
  let rightEyeVert = [];
  let coinVert = [];

  // this for loops pushes all the verticies for all the circles in the game
  let index;
  for (index = -350; index < 351; index++) {
    num = index / 100;
    playerFaceVert.push(Math.cos(num) / 10);
    playerFaceVert.push(Math.sin(num) / 10);
    playerFaceVert.push(0);

    monsterFaceVert.push(Math.cos(num) / 10);
    monsterFaceVert.push(Math.sin(num) / 10);
    monsterFaceVert.push(0);

    leftEyeVert.push(Math.cos(num) / 50 - 0.04);
    leftEyeVert.push(Math.sin(num) / 50 + 0.04);
    leftEyeVert.push(0);

    rightEyeVert.push(Math.cos(num) / 50 + 0.04);
    rightEyeVert.push(Math.sin(num) / 50 + 0.04);
    rightEyeVert.push(0);

    coinVert.push(Math.cos(num) / 10);
    coinVert.push(Math.sin(num) / 10);
    coinVert.push(0);
  }

  let smileVert = [];
  let frownVert = [];
  // this for loops creates all the verticies for the smile/frown
  for (index = -310; index < 0; index++) {
    num = index / 100;
    smileVert.push(Math.cos(num) / 15);
    smileVert.push(Math.sin(num) / 15);
    smileVert.push(0);

    num = -num;
    frownVert.push(Math.cos(num) / 15);
    frownVert.push(Math.sin(num) / 15 - 0.06);
    frownVert.push(0);
  }

  // this creates all the grid verticies
  let gridVert = []; //array to hold vertex positions
  const gridLimit = 0.9;
  let xPos = -gridLimit;
  let yPos = -gridLimit;
  const cellSize = 0.2;
  const gridSize = 22;
  for (i = 0; i < gridSize; i++) {
    gridVert.push(xPos);
    gridVert.push(yPos);
    gridVert.push(0);
    gridVert.push(xPos);
    gridVert.push(-yPos);
    gridVert.push(0);
    xPos = xPos + cellSize;
  }
  xPos = gridLimit;
  for (i = 0; i < gridSize; i++) {
    gridVert.push(xPos);
    gridVert.push(yPos);
    gridVert.push(0);
    gridVert.push(-xPos);
    gridVert.push(yPos);
    gridVert.push(0);
    yPos = yPos + cellSize;
  }

  let winTextVert = [
    // W
    ...[
      ...[-0.5, 0.5, 0],
      ...[-0.4, 0.3, 0],

      ...[-0.4, 0.3, 0],
      ...[-0.3, 0.5, 0],

      ...[-0.3, 0.5, 0],
      ...[-0.2, 0.3, 0],

      ...[-0.2, 0.3, 0],
      ...[-0.1, 0.5, 0],
    ],
    // I
    ...[
      ...[0, 0.5, 0],
      ...[0, 0.3, 0],
    ],
    // N
    ...[
      ...[0.1, 0.3, 0], 
      ...[0.1, 0.5, 0], 

      ...[0.3, 0.3, 0], 
      ...[0.1, 0.5, 0],
      
      ...[0.3, 0.3, 0], 
      ...[0.3, 0.5, 0],
    ],
  ];

  // need to modify vertices to display lose text.
  let loseTextVert = [
    //L
    ...[
      ...[-0.3, 0.5, 0],
      ...[-0.4, 0.3, 0],
      ...[-0.4, 0.3, 0],
      ...[-0.3, 0.3, 0],
    ],
    //O
    ...[
      ...[-0.2, 0.3, 0],
      ...[-0.1, 0.5, 0],

      ...[-0.1, 0.5, 0],
      ...[0, 0.5, 0],

      ...[-0.1, 0.3, 0], 
      ...[-0.2, 0.3, 0],

      ...[0, 0.5, 0], 
      ...[-0.1, 0.3, 0],
    ],
    //S
    ...[
      ...[0, 0.3, 0], 
      ...[0.1, 0.3, 0],

      ...[0.1, 0.3, 0],
      ...[0.15, 0.4, 0],

      ...[0.05, 0.4, 0],
      ...[0.1, 0.5, 0], 

      ...[0.05, 0.4, 0],
      ...[0.15, 0.4, 0],

      ...[0.1, 0.5, 0], 
      ...[0.2, 0.5, 0],
    ],
    // //E
    ...[
    ...[0.4, 0.5, 0],
    ...[0.3, 0.5, 0],

    ...[0.25, 0.4, 0], 
    ...[0.35, 0.4, 0],

    ...[0.3, 0.5, 0],
    ...[0.2, 0.3, 0],

    ...[0.3, 0.3, 0], 
    ...[0.2, 0.3, 0],
        ],
  ];

  // these store the number of verticies to be used later on
  playerFaceVertCount = playerFaceVert.length / 3;
  monsterFaceVertCount = monsterFaceVert.length / 3;
  leftEyeVertCount = leftEyeVert.length / 3;
  rightEyeVertCount = rightEyeVert.length / 3;
  smileVertCount = smileVert.length / 3;
  frownVertCount = frownVert.length / 3;
  coinVertCount = coinVert.length / 3;
  gridVertCount = gridVert.length / 3;
  winTextVertCount = winTextVert.length / 3;
  loseTextVertCount = loseTextVert.length / 3;

  //Setting up the VBO for the vertex positions
  playerFaceVertBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, playerFaceVertBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(playerFaceVert),
    gl.STATIC_DRAW
  );

  monsterFaceVertBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, monsterFaceVertBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(monsterFaceVert),
    gl.STATIC_DRAW
  );

  leftEyeVertBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, leftEyeVertBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(leftEyeVert), gl.STATIC_DRAW);

  rightEyeVertBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rightEyeVertBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(rightEyeVert),
    gl.STATIC_DRAW
  );

  smileVertBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, smileVertBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(smileVert), gl.STATIC_DRAW);

  frownVertBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, frownVertBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(frownVert), gl.STATIC_DRAW);

  coinVertBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, coinVertBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coinVert), gl.STATIC_DRAW);

  gridVertBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gridVertBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridVert), gl.STATIC_DRAW);

  winTextVertBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, winTextVertBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(winTextVert), gl.STATIC_DRAW);

  loseTextVertBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, loseTextVertBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(loseTextVert),
    gl.STATIC_DRAW
  );

  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

//We call drawModel to render to our canvas
function drawModel() {
  let [offsetX, offsetY] = [0, 0];
  gl.uniform1f(offsetXLoc, offsetX);
  gl.uniform1f(offsetYLoc, offsetY);

  //Clear the scene
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Render the grid
  gl.bindBuffer(gl.ARRAY_BUFFER, gridVertBuffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttrib3f(1, 0, 0.7, 0);
  gl.drawArrays(gl.LINES, 0, gridVertCount); //render all of the vertices (NumVertices)

  // This section renders the coins
  for (const coin of gameModel.coins) {
    // Offset
    [offsetX, offsetY] = coin.position.getXAndYOffset(
      gameModel.rows,
      gameModel.cols
    );
    gl.uniform1f(offsetXLoc, offsetX);
    gl.uniform1f(offsetYLoc, offsetY);

    // Draw
    gl.bindBuffer(gl.ARRAY_BUFFER, coinVertBuffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib3f(1, 1, 0.7, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, coinVertCount);
  }

  // This section below renders the player/hero
  // Offset
  [offsetX, offsetY] = gameModel.player.position.getXAndYOffset(
    gameModel.rows,
    gameModel.cols
  );
  gl.uniform1f(offsetXLoc, offsetX); //send the value of xOffset to the shaders
  gl.uniform1f(offsetYLoc, offsetY); //send the value of yOffset to the shaders

  // Draw
  gl.bindBuffer(gl.ARRAY_BUFFER, playerFaceVertBuffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttrib3f(1, 1, 1, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, playerFaceVertCount);

  gl.bindBuffer(gl.ARRAY_BUFFER, smileVertBuffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttrib3f(1, 1, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, smileVertCount);

  gl.bindBuffer(gl.ARRAY_BUFFER, leftEyeVertBuffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttrib3f(1, 0, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, leftEyeVertCount);

  gl.bindBuffer(gl.ARRAY_BUFFER, rightEyeVertBuffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttrib3f(1, 0, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, rightEyeVertCount);

  // This section below renders the monster
  // Offset
  [offsetX, offsetY] = gameModel.monster.position.getXAndYOffset(
    gameModel.rows,
    gameModel.cols
  );
  gl.uniform1f(offsetXLoc, offsetX); //send the value of xOffset to the shaders
  gl.uniform1f(offsetYLoc, offsetY); //send the value of yOffset to the shaders

  // Draw
  gl.bindBuffer(gl.ARRAY_BUFFER, monsterFaceVertBuffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttrib3f(1, 1, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, monsterFaceVertCount);

  gl.bindBuffer(gl.ARRAY_BUFFER, frownVertBuffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttrib3f(1, 0, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, frownVertCount);

  gl.bindBuffer(gl.ARRAY_BUFFER, leftEyeVertBuffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  gl.vertexAttrib3f(1, 0, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, leftEyeVertCount);

  gl.bindBuffer(gl.ARRAY_BUFFER, rightEyeVertBuffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  gl.vertexAttrib3f(1, 0, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, rightEyeVertCount);

  // Render the 'Win' text
  if (gameModel.gameState === GameState.PLAYER_WIN) {
    // Offset
    gl.uniform1f(offsetXLoc, 0);
    gl.uniform1f(offsetYLoc, 0);

    // Draw
    gl.bindBuffer(gl.ARRAY_BUFFER, winTextVertBuffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib3f(1, 1, 1, 0);
    gl.drawArrays(gl.LINES, 0, winTextVertCount);
  }

  // Render the 'Lose' text
  if (gameModel.gameState === GameState.MONSTER_WIN) {
    // Offset
    gl.uniform1f(offsetXLoc, 0);
    gl.uniform1f(offsetYLoc, 0);

    // Draw
    gl.bindBuffer(gl.ARRAY_BUFFER, loseTextVertBuffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib3f(1, 1, 0, 0);
    gl.drawArrays(gl.LINES, 0, loseTextVertCount);
  }

  //Clean
  gl.bindVertexArray(null);
}

//return the WebGL context to the caller
function initModel(view) {
  gl = getGLContext(view);
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0.0, 0.0, view.width, view.height);

    initProgram();

    offsetXLoc = gl.getUniformLocation(program, "offsetX");
    offsetYLoc = gl.getUniformLocation(program, "offsetY");

    gameModel = new Game();

    initBuffers();

    return gl;
  }
  return null;
}

function getGameModel() {
  return gameModel;
}

const TokenType = {
  PLAYER: "PLAYER",
  MONSTER: "MONSTER",
  COIN: "COIN",
  WALL: "WALL",
};

class Position {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  equals(otherPosition) {
    return this.row === otherPosition.row && this.col === otherPosition.col;
  }

  getRow() {
    return this.row;
  }

  getCol() {
    return this.col;
  }

  getRowAndCol() {
    return [this.row, this.col];
  }

  getXAndYOffset(rows, cols) {
    // X and Y range for grid is [-0.8, 0.8]
    return [
      (this.col / (cols - 1)) * 1.6 - 0.8,
      (this.row / (rows - 1)) * 1.6 - 0.8,
    ];
  }
}

class Token {
  constructor(tokenType, position) {
    this.tokenType = tokenType;
    this.position = position;
  }
}

const GameState = {
  ACTIVE: "ACTIVE",
  PLAYER_WIN: "PLAYER_WIN",
  MONSTER_WIN: "MONSTER_WIN",
};

class Game {
  constructor() {
    this.monsterSpeed = 1000;
    this.restart();
  }

  restart() {
    this.rows = 9;
    this.cols = 9;
    this.monsterSpeed *= 0.75;
    this.gameState = GameState.ACTIVE;

    // Put the player in the top left
    this.player = new Token(TokenType.PLAYER, new Position(this.rows - 1, 0));
    // Put the monster in the bottom right
    this.monster = new Token(TokenType.MONSTER, new Position(0, this.cols - 1));
    this.coins = [];
    this.walls = [];

    // Generate random position for four coins
    for (let i = 0; i < 4; i++) {
      while (true) {
        const potentialRow = Math.floor(Math.random() * this.rows);
        const potentialCol = Math.floor(Math.random() * this.cols);
        const potentialPos = new Position(potentialRow, potentialCol);
        if (!this.occupiedByToken(potentialPos)) {
          this.coins.push(new Token(TokenType.COIN, potentialPos));
          break;
        }
      }
    }

    // Generate random position for three walls.
    this.walls = [];
    // for (let i = 0; i < 3; i++) {
    //   while (true) {
    //     const potentialRow = Math.floor(Math.random() * this.rows);
    //     const potentialCol = Math.floor(Math.random() * this.cols);
    //     const potentialPos = new Position(potentialRow, potentialCol);
    //     if (!this.occupiedByToken(potentialPos)) {
    //       this.walls.push(new Token(TokenType.WALL, potentialPos));
    //       break;
    //     }
    //   }
    // }
  }

  updatePlayerPosition(rowOffset, colOffset) {
    if (this.gameState !== GameState.ACTIVE) {
      return;
    }

    const [row, col] = this.player.position.getRowAndCol();
    const newPosition = new Position(row + rowOffset, col + colOffset);

    if (this.outOfBounds(newPosition) || this.occupiedByWall(newPosition)) {
      return;
    }

    this.player.position = newPosition;
    this.processCollisions();
  }

  outOfBounds(position) {
    const [row, col] = position.getRowAndCol();

    return row < 0 || col < 0 || row >= this.rows || col >= this.cols;
  }

  occupiedByToken(position) {
    return (
      [
        this.player.position,
        this.monster.position,
        ...this.coins.map((coin) => coin.position),
        ...this.walls.map((wall) => wall.position),
      ].filter((p) => p.equals(position)).length > 0
    );
  }

  occupiedByWall(position) {
    return (
      this.walls.map((wall) => wall.position).filter((p) => p.equals(position))
        .length > 0
    );
  }

  updateMonsterPosition() {
    if (this.gameState !== GameState.ACTIVE) {
      return;
    }
    let rowOffset = 0;
    let colOffset = 0;

    const [monsterRow, monsterCol] = this.monster.position.getRowAndCol();
    const [playerRow, playerCol] = this.player.position.getRowAndCol();

    // Naive algorithm to move the monster towards the player.
    if (monsterRow < playerRow) {
      rowOffset = 1;
    } else if (monsterRow > playerRow) {
      rowOffset = -1;
    } else if (monsterCol < playerCol) {
      colOffset = 1;
    } else if (monsterCol > playerCol) {
      colOffset = -1;
    }

    const newPosition = new Position(
      monsterRow + rowOffset,
      monsterCol + colOffset
    );
    if (this.outOfBounds(newPosition) || this.occupiedByWall(newPosition)) {
      return;
    }

    this.monster.position = newPosition;
    this.processCollisions();
  }

  processCollisions() {
    if (this.gameState !== GameState.ACTIVE) {
      return;
    }
    // Monster wins if monster collided with player
    if (this.player.position.equals(this.monster.position)) {
      this.gameState = GameState.MONSTER_WIN;
      return;
    }
    // Coin is collected if player collided with coin
    this.coins = this.coins.filter(
      (coin) => !this.player.position.equals(coin.position)
    );
    // Player wins if all coins have been collected
    if (this.coins.length === 0) {
      this.gameState = GameState.PLAYER_WIN;
      return;
    }
    return;
  }
}
