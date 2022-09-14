//FileName:		model.js
//Programmer:	Dan Cliburn
//Date:			8/11/2020
//Purpose:		This file defines the code for our WebGL 2 model
//The "model" is all of the WebGL2 code that draws our graphics scene

//these variables can be accessed in any function
let gl;
let program;
let squareVertexBuffer, triangleVB, diamondVB;
let squareVertexColorBuffer, triangleVCB;
let squareIndexBuffer, diamondIB;
let indices, indices_diamond;
let xOffset, yOffset;
let offsetXLoc, offsetYLoc; //These are used to access uniform variables in the shaders
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
  //array data for the square
  const vertices = [-0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0.0];
  const colors = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0];

  //array data for the diamond - note that I will reuse the square's colors array for the diamond
  const vertices_diamond = [
    -1, -0.75, 0, -0.75, -1, 0, -0.5, -0.75, 0, -0.75, -0.5, 0,
  ];

  //array data for a triangle in the upper right corner of the screen
  const vertices2 = [0.5, 0.5, 0, 1.0, 0.5, 0, 0.75, 1.0, 0];
  const colors2 = [0.5, 0.5, 0, 0, 0.5, 0.5, 0.5, 0, 0.5];

  //Indices defined in counter-clockwise order
  indices = [0, 1, 2, 0, 2, 3];
  indices_diamond = [0, 1, 3, 2, 1, 3];

  //Setting up the VBO for the SQUARE vertex positions
  squareVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  //Setting up the IBO for the SQUARE
  squareIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  //Setting up the VBO for the SQUARE vertex colors
  squareVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  //Setting up the VBO for TRIANGLE vertex positions
  triangleVB = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVB);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);

  //Setting up the VBO for TRIANGLE vertex colors
  triangleVCB = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVCB);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors2), gl.STATIC_DRAW);

  //Setting up the VBO for the DIAMOND vertex positions
  diamondVB = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, diamondVB);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertices_diamond),
    gl.STATIC_DRAW
  );

  //Setting up the IBO for the DIAMOND
  diamondIB = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, diamondIB);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices_diamond),
    gl.STATIC_DRAW
  );

  //Clean
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

//We call drawModel to render to our canvas
//This function is similar to the draw() function defined in the section "Time for Action: Rendering a Square" of the textbook
function drawModel() {
  console.log("player:", gameModel.player.position.getRowAndCol());
  console.log("monster:", gameModel.monster.position.getRowAndCol());
  console.log("gameState:", gameModel.gameState);

  //Clear the scene
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  //TODO: For task two you will need to make code changes here

  //Use the buffers we've constructed - first the vertex positions
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  //Now the vertex colors
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(1);

  //Bind IBO
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);

  //Draw to the scene using triangle primitives
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

  //Now draw the diamond
  //Use the buffers we've constructed - first the vertex positions
  gl.bindBuffer(gl.ARRAY_BUFFER, diamondVB);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  //reuse the square color buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(1);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, diamondIB);
  gl.drawElements(gl.TRIANGLES, indices_diamond.length, gl.UNSIGNED_SHORT, 0);

  gl.uniform1f(offsetXLoc, xOffset);
  gl.uniform1f(offsetYLoc, yOffset);

  //Now draw the triangle
  //Use the buffers we've constructed - first the vertex positions
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVB);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  //Now the vertex colors
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVCB);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(1);

  //Draw using drawArrays
  //TODO: For task two you will need to make code changes here
  gl.drawArrays(gl.TRIANGLES, 0, 3); //The '3' tells drawArrays there are 3 vertices

  gl.uniform1f(offsetXLoc, 0);
  gl.uniform1f(offsetYLoc, 0);

  //Clean
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

//return the WebGL context to the caller
function initModel(view) {
  gl = getGLContext(view);
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0.0, 0.0, view.width, view.height);

    initProgram();

    //NEW LAB 3 CODE TO WORK WITH THE UNIFORM VARIABLES
    xOffset = 0;
    yOffset = 0;
    offsetXLoc = gl.getUniformLocation(program, "offsetX");
    //TODO: Add the code to find the location of offsetY in the shaders and store in offsetYLoc
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

  updateRowAndCol(rowOffset, colOffset) {
    this.row += rowOffset;
    this.col += colOffset;
  }

  getXAndYOffset() {
    return [(this.row / rows) * 2 - 1, (this.col / cols) * 2 - 1];
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
    this.rows = 9;
    this.cols = 9;
    this.gameState = GameState.ACTIVE;

    this.player = new Token(TokenType.PLAYER, new Position(0, 0));
    this.monster = new Token(
      TokenType.MONSTER,
      new Position(this.rows - 1, this.cols - 1)
    );
    this.coins = [
      new Token(TokenType.COIN, new Position(2, 2)),
      new Token(TokenType.COIN, new Position(2, 6)),
      new Token(TokenType.COIN, new Position(6, 2)),
      new Token(TokenType.COIN, new Position(6, 6)),
    ];
  }

  updatePlayerPosition(rowOffset, colOffset) {
    if (this.gameState !== GameState.ACTIVE) {
      return;
    }

    const [row, col] = this.player.position.getRowAndCol();

    if (this.outOfBounds(new Position(row + rowOffset, col + colOffset))) {
      return;
    }

    this.player.position.updateRowAndCol(rowOffset, colOffset);
    this.processCollisions();
  }

  outOfBounds(position) {
    return (
      position.getRow() < 0 ||
      position.getCol() < 0 ||
      position.getRow() >= this.rows ||
      position.getCol() >= this.cols
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

    if (monsterRow < playerRow) {
      rowOffset = 1;
    } else if (monsterRow > playerRow) {
      rowOffset = -1;
    } else if (monsterCol < playerCol) {
      colOffset = 1;
    } else if (monsterCol > playerCol) {
      colOffset = -1;
    }

    this.monster.position.updateRowAndCol(rowOffset, colOffset);
    this.processCollisions();
  }

  processCollisions() {
    if (this.gameState !== GameState.ACTIVE) {
      return;
    }
    if (this.player.position.equals(this.monster.position)) {
      this.gameState = GameState.MONSTER_WIN;
      return;
    }
    this.coins = this.coins.filter(
      (coin) => !this.player.position.equals(coin.position)
    );
    if (this.coins.length === 0) {
      this.gameState = GameState.PLAYER_WIN;
      return;
    }
    return;
  }
}
