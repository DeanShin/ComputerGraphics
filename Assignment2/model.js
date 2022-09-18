//FileName:		model.js
//Programmer:	Dan Cliburn, Dean S., Chris C., Chris S.
//Date:			8/11/2020
//Purpose:		This file defines the code for our WebGL 2 model
//The "model" is all of the WebGL2 code that draws our graphics scene

//these variables can be accessed in any function
let gl;
let program;
let offsetXLoc, offsetYLoc; //These are used to access uniform variables in the shaders
let vertexBuffer;
let vertex1Buffer;
let vertex2Buffer;
let vertex3Buffer;
let vertex4Buffer;
let vertex5Buffer;
let vertex6Buffer;
let vertex7Buffer;
let vertex8Buffer;
let winBuffer;
let loseBuffer;

let numVertices;
let numVertices1;
let numVertices2;
let numVertices3;
let numVertices4;
let numVertices5;
let numVertices6;
let numVertices7;
let numVertices8;
let gridNumVertices;
let winNumVertices;
let loseNumVertices;
let gameModel;

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
  // yellow circle
  let vertices = [];
  let colors = [];

  // red smile
  let vertices1 = [];
  let colors1 = [];

  // right eye
  let vertices2 = [];
  let colors2 = [];

  // left eye
  let vertices3 = [];
  let colors3 = [];

  //red frown
  let vertices4 = [];
  let colors4 = [];

  // red circle
  let vertices5 = [];
  let colors5 = [];

  // right eye mad
  let vertices6 = [];
  let colors6 = [];

  //left eye mad
  let vertices7 = [];
  let colors7 = [];

  //coin 1
  let vertices8 = [];
  let colors8 = [];

  //coin 2
  let vertices9 = [];
  let colors9 = [];

  //coin 3
  let vertices10 = [];
  let colors10 = [];

  //coin 4
  let vertices11 = [];
  let colors11 = [];

  // this for loops pushes all the verticies for all the circles in the game
  let index;
  for (index = -350; index < 351; index++) {
    num = index / 100;
    vertices.push(Math.cos(num) / 10);
    vertices.push(Math.sin(num) / 10);
    vertices.push(0);

    vertices5.push(Math.cos(num) / 10);
    vertices5.push(Math.sin(num) / 10);
    vertices5.push(0);

    vertices2.push(Math.cos(num) / 50 + 0.04);
    vertices2.push(Math.sin(num) / 50 + 0.04);
    vertices2.push(0);

    vertices6.push(Math.cos(num) / 50 + 0.04);
    vertices6.push(Math.sin(num) / 50 + 0.04);
    vertices6.push(0);

    vertices3.push(Math.cos(num) / 50 - 0.04);
    vertices3.push(Math.sin(num) / 50 + 0.04);
    vertices3.push(0);

    vertices7.push(Math.cos(num) / 50 - 0.04);
    vertices7.push(Math.sin(num) / 50 + 0.04);
    vertices7.push(0);

    // Coin
    num = index / 100;
    vertices8.push(Math.cos(num) / 10);
    vertices8.push(Math.sin(num) / 10);
    vertices8.push(0);
  }
  // this for loops pushes the colors for all the circles
  for (index = 0; index < 701; index++) {
    colors.push([1.0, 1.0, 0.0]);
    colors5.push([1.0, 0.0, 0.0]);

    colors2.push([0.0, 0.0, 0.0]);
    colors6.push([0.0, 0.0, 0.0]);

    colors3.push([0.0, 0.0, 0.0]);
    colors7.push([0.0, 0.0, 0.0]);

    // Coin
    colors8.push([1.0, 0.7, 0.0]);
  }

  // this for loops creates all the verticies for the smile/frown
  for (index = -310; index < 0; index++) {
    num = index / 100;
    vertices1.push(Math.cos(num) / 15);
    vertices1.push(Math.sin(num) / 15);
    vertices1.push(0);

    num = -num;
    vertices4.push(Math.cos(num) / 15);
    vertices4.push(Math.sin(num) / 15 - 0.06);
    vertices4.push(0);
  }
  // pushes color to the frown/smile
  for (index = 0; index < 310; index++) {
    colors1.push([1.0, 0.0, 0.0]);
    colors4.push([0.0, 0.0, 0.0]);
  }

  // this creates all the grid verticies

  let gridVert = []; //array to hold vertex positions
  let gridLimit = 0.9;
  let xPos = -gridLimit;
  let yPos = -gridLimit;
  let cellSize = 0.2;
  let gridSize = 22;
  gridNumVertices = gridSize * 4;
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

  let winText = [
    ...[
      ...[-0.5, 0.5, 0],
      ...[-0.4, 0.3, 0],
      ...[-0.3, 0.5, 0],
      ...[-0.2, 0.3, 0],
      ...[-0.1, 0.5, 0],
    ],
    ...[...[0.0, 0.5, 0], ...[0, 0.3, 0]],
    ...[...[0.1, 0.3, 0], ...[0.1, 0.5, 0], ...[0.3, 0.3, 0], ...[0.3, 0.5, 0]],
  ];
  winNumVertices = 11;

  // need to modify vertiies to display lose text.

  let loseText = [
    ...[
      ...[-0.5, 0.5, 0],
      ...[-0.5, 0, 0],
      ...[-0.3, 0, 0],
      ...[-0.3, 0.5, 0],
      ...[-0.2, 0.5, 0],
    ],
    ...[...[-0.2, 0, 0], ...[-0.3, 0, 0], ...[-0.1, 0, 0], , ...[-0.1, 0.5, 0]],
    ...[
      ...[0, 0.5, 0],
      ...[0.1, 0.5, 0],
      ...[0, 0.5, 0],
      ...[0, 0.3, 0],
      ...[0.1, 0.3, 0],
      ...[0, 0.3, 0],
      ...[0, 0, 0],
      ...[0.1, 0, 0],
    ],
  ];
  loseNumVertices = 17;

  // these store the number of verticies to be used later on

  numVertices = vertices.length / 3;
  numVertices1 = vertices1.length / 3;
  numVertices2 = vertices2.length / 3;
  numVertices3 = vertices3.length / 3;
  numVertices4 = vertices4.length / 3;
  numVertices5 = vertices5.length / 3;
  numVertices6 = vertices6.length / 3;
  numVertices7 = vertices7.length / 3;
  numVertices8 = vertices8.length / 3;

  //Setting up the VBO for the vertex positions
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  vertex1Buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex1Buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices1), gl.STATIC_DRAW);

  vertex2Buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex2Buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);

  vertex3Buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex3Buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices3), gl.STATIC_DRAW);

  vertex4Buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex4Buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices4), gl.STATIC_DRAW);

  vertex5Buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex5Buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices5), gl.STATIC_DRAW);

  vertex6Buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex6Buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices6), gl.STATIC_DRAW);

  vertex7Buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex7Buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices7), gl.STATIC_DRAW);

  vertex8Buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex8Buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices8), gl.STATIC_DRAW);

  gridBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridVert), gl.STATIC_DRAW);

  winBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, winBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(winText), gl.STATIC_DRAW);

  loseBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, loseBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(loseText), gl.STATIC_DRAW);

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
  gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttrib3f(1, 0, 0.7, 0);
  gl.drawArrays(gl.LINES, 0, gridNumVertices); //render all of the vertices (NumVertices)

  // Render the 'Win' text
  if (gameModel.gameState === GameState.PLAYER_WIN) {
    gl.uniform1f(offsetXLoc, 0); //send the value of xOffset to the shaders
    gl.uniform1f(offsetYLoc, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, winBuffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib3f(1, 1, 1, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, winNumVertices); //render all of the vertices (NumVertices
  }

  // Render the 'Lose' text
  if (gameModel.gameState === GameState.MONSTER_WIN) {
    gl.uniform1f(offsetXLoc, 0); //send the value of xOffset to the shaders
    gl.uniform1f(offsetYLoc, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, loseBuffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib3f(1, 1, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, loseNumVertices); //render all of the vertices (NumVertices
  }

  // This section renders the coins
  for (const coin of gameModel.coins) {
    [offsetX, offsetY] = coin.position.getXAndYOffset(
      gameModel.rows,
      gameModel.cols
    );
    gl.uniform1f(offsetXLoc, offsetX);
    gl.uniform1f(offsetYLoc, offsetY);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex8Buffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib3f(1, 1, 0.7, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, numVertices8);
  }

  // This section below renders the player/hero
  [offsetX, offsetY] = gameModel.player.position.getXAndYOffset(
    gameModel.rows,
    gameModel.cols
  );
  gl.uniform1f(offsetXLoc, offsetX); //send the value of xOffset to the shaders
  gl.uniform1f(offsetYLoc, offsetY); //send the value of yOffset to the shaders

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttrib3f(1, 1, 1, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, numVertices);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex1Buffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttrib3f(1, 1, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, numVertices1); //render all of the vertices (NumVertices)

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex2Buffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttrib3f(1, 0, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, numVertices2); //render all of the vertices (NumVertices)

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex3Buffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttrib3f(1, 0, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, numVertices3); //render all of the vertices (NumVertices)

  // This section below renders the monster
  [offsetX, offsetY] = gameModel.monster.position.getXAndYOffset(
    gameModel.rows,
    gameModel.cols
  );
  gl.uniform1f(offsetXLoc, offsetX); //send the value of xOffset to the shaders
  gl.uniform1f(offsetYLoc, offsetY); //send the value of yOffset to the shaders

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex5Buffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttrib3f(1, 1, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, numVertices5);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex4Buffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttrib3f(1, 0, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, numVertices4); //render all of the vertices (NumVertices)

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex6Buffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  gl.vertexAttrib3f(1, 0, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, numVertices6); //render all of the vertices (NumVertices)

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex7Buffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  gl.vertexAttrib3f(1, 0, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, numVertices7); //render all of the vertices (NumVertices)

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
