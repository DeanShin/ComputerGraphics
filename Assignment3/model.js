//FileName:		model.js
//Programmer: Dan Cliburn, Dean S, Chris C, Chris S
//Date:       10/03/2020
//Purpose:		This file defines the code for our WebGL 2 model
//The "model" is all of the WebGL2 code that draws our graphics scene

//These variables can be accessed in any function
let gl;
let program;
let VAOBG, BGVPB, BGIB;
let VAO0, tetrahedronVPB0, tetrahedronIB0;
let VAO1, tetrahedronVPB1, tetrahedronIB1;
let VAO2, tetrahedronVPB2, tetrahedronIB2;
let VAO3, tetrahedronVPB3, tetrahedronIB3;
let pointLightX, pointLightY; //will be used to move the point light
let globalAmbientLightLoc,
  pointLightColorLoc,
  pointLightPosLoc,
  directionalLightColorLoc,
  directionalLightPosLoc,
  constantAttenLoc,
  linearAttenLoc,
  quadraticAttenLoc;

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
//function used to aid in the rendering of tetrahedron shapes in the scene. Takes in offsets.
function createTetra(offX, offY, offZ) {
  let tetrahedron = [
    ...[0, 0, -0.3],
    ...[0.2, 0.1, 0.2],
    ...[-0.2, 0.1, 0.2],
    ...[0, -0.2, 0.2],
  ];
  let positions = [];
  for (i = 0; i < 4; i++) {
    positions.push(tetrahedron[i * 3] + offX);
    positions.push(tetrahedron[i * 3 + 1] + offY);
    positions.push(tetrahedron[i * 3 + 2] + offZ);
  }
  return positions;
}
//Set up the buffers we need to use for rendering
//This function is similar to what is defined in the section "Time for Action: Rendering a Square" of the textbook
function initBuffers() {
  //background vertices
const bgVert = [
  ...[-2, -1, 0],
  ...[0, 1, 1],
  ...[2, -1, 0],
];

  VAOBG = gl.createVertexArray();
  gl.bindVertexArray(VAOBG);

  //Set up the VBO for the background vertex positions
  BGVPB = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, BGVPB);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(bgVert),
    gl.STATIC_DRAW
  );
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0

  //Set up the IBO for the background
  BGIB = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, BGIB);

  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  VAO0 = gl.createVertexArray();
  gl.bindVertexArray(VAO0);

  //Set up the VBO for the tetrahedron vertex positions
  tetrahedronVPB0 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tetrahedronVPB0);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(createTetra(-0.4, -0.2, 1.2)),
    gl.STATIC_DRAW
  );
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0

  //Set up the IBO for the tetrahedron
  tetrahedronIB0 = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tetrahedronIB0);

  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  //Set up Vertex Array Object
  VAO1 = gl.createVertexArray();
  gl.bindVertexArray(VAO1);

  //Set up the VBO for the tetrahedron vertex positions
  tetrahedronVPB1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tetrahedronVPB1);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(createTetra(0.1, 0.2, 0)),
    gl.STATIC_DRAW
  );
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0

  //Set up the IBO for the tetrahedron
  tetrahedronIB1 = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tetrahedronIB1);

  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  VAO2 = gl.createVertexArray();
  gl.bindVertexArray(VAO2);

  //Set up the VBO for the tetrahedron vertex positions
  tetrahedronVPB2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tetrahedronVPB2);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(createTetra(-0.6, -0.6, 1)),
    gl.STATIC_DRAW
  );
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0

  //Set up the IBO for the tetrahedron
  tetrahedronIB2 = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tetrahedronIB2);

  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  VAO3 = gl.createVertexArray();
  gl.bindVertexArray(VAO3);

  //Set up the VBO for the tetrahedron vertex positions
  tetrahedronVPB3 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tetrahedronVPB3);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(createTetra(0.6, -0.4, 0.2)),
    gl.STATIC_DRAW
  );
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0

  //Set up the IBO for the tetrahedron
  tetrahedronIB3 = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tetrahedronIB3);

  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

//initialize the lights
function initLights() {
  //find uniform variable locations
  globalAmbientLightLoc = gl.getUniformLocation(program, "globalAmbientLight");
  pointLightColorLoc = gl.getUniformLocation(program, "point_light_color");
  pointLightPosLoc = gl.getUniformLocation(program, "point_light_position");
  directionalLightColorLoc = gl.getUniformLocation(
    program,
    "directional_light_color"
  );
  directionalLightPosLoc = gl.getUniformLocation(
    program,
    "directional_light_position"
  );
  constantAttenLoc = gl.getUniformLocation(program, "constantAttenuation");
  linearAttenLoc = gl.getUniformLocation(program, "linearAttenuation");
  quadraticAttenLoc = gl.getUniformLocation(program, "quadraticAttenuation");

  //set up the light for the scene
  pointLightX = 0.0;
  pointLightY = 0.0;
  gl.uniform3f(globalAmbientLightLoc, 0.1, 0.1, 0.1); //minimum light level in the scene
  gl.uniform4f(pointLightColorLoc, 1.0, 1.0, 1.0, 1.0); //color of the point light
  gl.uniform4f(pointLightPosLoc, pointLightX, pointLightY, -1.0, 1.0); //point light since w = 1
  gl.uniform4f(directionalLightColorLoc, 0.5, 0.5, 0.5, 1.0); //color of the directional light
  gl.uniform4f(directionalLightPosLoc, 0, -0.5, -0.5, 0); // directional light since w = 0
  gl.uniform1f(constantAttenLoc, 1.0);
  gl.uniform1f(linearAttenLoc, 0.1);
  gl.uniform1f(quadraticAttenLoc, 0.3);
}
function drawTetra(VAOin) {
  gl.bindVertexArray(VAOin);

  //TODO: change the shininess coefficient
  gl.vertexAttrib1f(3, 0.75); //use a static vertex attribute (location == 3) to set shininess for all sides to 1.0
  //Draw the tetrahedron - side 1
  const indices1 = [0, 2, 1]; //Indices for side 1. Define in a counter-clockwise order.
  gl.vertexAttrib3f(1, 1, 0, 0); //use a static vertex attribute (location == 1) to set the color to red
  gl.vertexAttrib3f(2, 0, 0.6, -0.3); //use a static vertex attribute (location == 2) to set the normal vector
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices1),
    gl.DYNAMIC_DRAW
  );
  gl.drawElements(gl.TRIANGLES, indices1.length, gl.UNSIGNED_SHORT, 0);

  //Draw the tetrahedron - side 2
  const indices2 = [2, 3, 0]; //Indices for side 3. Define in a counter-clockwise order.
  gl.vertexAttrib3f(1, 0, 0, 1); //use a static vertex attribute (location == 1) to set the color to blue
  gl.vertexAttrib3f(2, -0.6, -0.3, -0.3); //use a static vertex attribute (location == 2) to set the normal vector
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices2),
    gl.DYNAMIC_DRAW
  );
  gl.drawElements(gl.TRIANGLES, indices1.length, gl.UNSIGNED_SHORT, 0);

  //Draw the tetrahedron - side 3
  const indices3 = [1, 0, 3]; //Indices for side 4. Define in a counter-clockwise order.
  gl.vertexAttrib3f(1, 1, 1, 1); //use a static vertex attribute (location == 1) to set the color to white
  gl.vertexAttrib3f(2, 0.6, -0.3, -0.3); //use a static vertex attribute (location == 2) to set the normal vector
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices3),
    gl.DYNAMIC_DRAW
  );
  gl.drawElements(gl.TRIANGLES, indices1.length, gl.UNSIGNED_SHORT, 0);

  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}
//We call drawModel to render to our canvas
//This function is similar to the draw() function defined in the section "Time for Action: Rendering a Square" of the textbook
function drawModel() {
  //Clear the scene
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.bindVertexArray(VAOBG);

  //TODO: change the shininess coefficient
  gl.vertexAttrib1f(3, 0.75); //use a static vertex attribute (location == 3) to set shininess for all sides to 1.0
  //Draw the BG
  const indicesBG = [2,1,0]; //Indices for side 1. Define in a counter-clockwise order.
  gl.vertexAttrib3f(1, 0.01, 0.01, 0.01); //use a static vertex attribute (location == 1) to set the color to red
  gl.vertexAttrib3f(2, 0, 0.6, -0.3); //use a static vertex attribute (location == 2) to set the normal vector
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indicesBG),
    gl.DYNAMIC_DRAW
  );
  gl.drawElements(gl.TRIANGLES, indicesBG.length, gl.UNSIGNED_SHORT, 0);
  drawTetra(VAO0);
  drawTetra(VAO1);
  drawTetra(VAO2);
  drawTetra(VAO3);

}

//return the WebGL context to the caller
function initModel(view) {
  gl = getGLContext(view);
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0.0, 0.0, view.width, view.height);

    initProgram();

    //SET UP UNIFORM VARIABLES
    xOffset = 0;
    yOffset = 0;

    initBuffers();
    initLights();

    return gl;
  }
  return null;
}

function updateModelX(offset) {
  pointLightX = pointLightX + offset;
  gl.uniform4f(pointLightPosLoc, pointLightX, pointLightY, -1.0, 1.0); //positional light since w = 1
}

function updateModelY(offset) {
  pointLightY = pointLightY + offset;
  gl.uniform4f(pointLightPosLoc, pointLightX, pointLightY, -1.0, 1.0); //positional light since w = 1
}

function resetModel() {
  pointLightX = 0;
  pointLightY = 0;
  gl.uniform4f(pointLightPosLoc, pointLightX, pointLightY, -1.0, 1.0); //positional light since w = 1
}

function turnLightOff() {
  gl.uniform4f(pointLightColorLoc, 0, 0, 0, 1); //positional light since w = 1
}

function turnLightOn() {
  gl.uniform4f(pointLightColorLoc, 1, 1, 1, 1); //positional light since w = 1
}

function turnDirLightOff() {
  gl.uniform4f(directionalLightColorLoc, 0, 0, 0, 0); //directional light since w = 0
}

function turnDirLightOn() {
  gl.uniform4f(directionalLightColorLoc, 0.5, 0.5, 0.5, 1); //directional light since w = 0
}
