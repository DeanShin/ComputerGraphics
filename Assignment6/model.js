//FileName:		model.js
//Programmer:	Dan Cliburn, Dean Shin
//Date:			  10/26/2020
//Purpose:		This file defines the code for our WebGL 2 model
//The "model" is all of the WebGL2 code that draws our graphics scene

//These variables can be accessed in any function
let gl;
let program;
let cubeVAO, cubeIndices;
let localRotZ;
let rotX, rotY;
let globalAmbientLightLoc,
  lightColorLoc,
  lightPosLoc,
  constantAttenLoc,
  linearAttenLoc,
  quadraticAttenLoc;
let modelMatrixLoc, viewMatrixLoc, projectionMatrixLoc;

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

//Set up the buffers and VAO we need for rendering the objects for our scene
function initBuffers() {
  const cubePositions = [
    // front
    ...[-1, -1, -1],
    ...[1, -1, -1],
    ...[-1, 1, -1],
    ...[1, 1, -1],
    // back
    ...[-1, -1, 1],
    ...[1, -1, 1],
    ...[-1, 1, 1],
    ...[1, 1, 1],
    // left,
    ...[-1, -1, -1],
    ...[-1, 1, -1],
    ...[-1, -1, 1],
    ...[-1, 1, 1],
    // right
    ...[1, -1, -1],
    ...[1, 1, -1],
    ...[1, -1, 1],
    ...[1, 1, 1],
    // top
    ...[-1, -1, -1],
    ...[1, -1, -1],
    ...[-1, -1, 1],
    ...[1, -1, 1],
    // bottom
    ...[-1, 1, -1],
    ...[1, 1, -1],
    ...[-1, 1, 1],
    ...[1, 1, 1],
  ];

  cubeIndices = [
    // front
    ...[0, 1, 2, 3, 2, 1],
    // back
    ...[4, 5, 6, 7, 6, 5],
    // left
    ...[8, 9, 10, 11, 10, 9],
    // right
    ...[12, 13, 14, 15, 14, 13],
    // top
    ...[16, 17, 18, 19, 18, 17],
    // bottom
    ...[20, 21, 22, 23, 22, 21],
  ];

  const cubeNormals = [
    // front
    ...[...[0, 0, -1], ...[0, 0, -1], ...[0, 0, -1], ...[0, 0, -1]],
    // back
    ...[...[0, 0, 1], ...[0, 0, 1], ...[0, 0, 1], ...[0, 0, 1]],
    // left
    ...[...[-1, 0, 0], ...[-1, 0, 0], ...[-1, 0, 0], ...[-1, 0, 0]],
    // right
    ...[...[1, 0, 0], ...[1, 0, 0], ...[1, 0, 0], ...[1, 0, 0]],
    // top
    ...[...[0, 0, 1], ...[0, 0, 1], ...[0, 0, 1], ...[0, 0, 1]],
    // bottom
    ...[...[0, 0, -1], ...[0, 0, -1], ...[0, 0, -1], ...[0, 0, -1]],
  ];

  //Set up Vertex Array Object
  cubeVAO = gl.createVertexArray();
  gl.bindVertexArray(cubeVAO);

  //Set up the VBO for the cube vertex positions
  const cubeVertexPB = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPB);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(cubePositions),
    gl.STATIC_DRAW
  );
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  const cubeVertexIBO = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIBO);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(cubeIndices),
    gl.STATIC_DRAW
  );

  const cubeVertexNormalPB = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalPB);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeNormals), gl.STATIC_DRAW);
  gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(2);

  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

//initialize the lights
function initLights() {
  //find uniform variable locations for the light
  globalAmbientLightLoc = gl.getUniformLocation(program, "globalAmbientLight");
  lightColorLoc = gl.getUniformLocation(program, "light_color");
  lightPosLoc = gl.getUniformLocation(program, "light_position");
  constantAttenLoc = gl.getUniformLocation(program, "constantAttenuation");
  linearAttenLoc = gl.getUniformLocation(program, "linearAttenuation");
  quadraticAttenLoc = gl.getUniformLocation(program, "quadraticAttenuation");

  //set up the light for the scene
  gl.uniform3f(globalAmbientLightLoc, 0.2, 0.2, 0.2); //minimum light level in the scene
  gl.uniform4f(lightColorLoc, 1.0, 1.0, 1.0, 1.0); //color of the light (in this case it is white)
  gl.uniform4f(lightPosLoc, 0.0, 5.0, 5.0, 1.0); //positional light since w = 1
  gl.uniform1f(constantAttenLoc, 1.0); //these settings specify no light attenuation
  gl.uniform1f(linearAttenLoc, 0.0);
  gl.uniform1f(quadraticAttenLoc, 0.0);
}

//We call drawModel to render to our canvas
function drawModel() {
  //Clear the scene
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  //Declare all of the matrices we will need for our transformations
  var mat4 = glMatrix.mat4;
  var projection_matrix = mat4.create();
  var view_matrix = mat4.create();
  var model_matrix = mat4.create();
  var scale_matrix = mat4.create();
  var translate_matrix = mat4.create();
  var rotate_matrix = mat4.create();
  var globalRotateMatrix = mat4.create();

  // Set up the projection matrix.
  projection_matrix = mat4.frustum(
    projection_matrix,
    -0.1,
    0.1,
    -0.1,
    0.1,
    0.1,
    20.0
  );
  gl.uniformMatrix4fv(projectionMatrixLoc, false, projection_matrix); //send the projection matrix to the shaders

  //Set up the view orientation transformation matrix
  var eye = [0, 0.0, 2];
  var aim = [0.0, 0.0, 0.5]; //set the aim a little down the negative z-axis in front of the eye
  var up = [0.0, 1.0, 0];
  view_matrix = mat4.lookAt(view_matrix, eye, aim, up); //calculate the view orientation matrix
  gl.uniformMatrix4fv(viewMatrixLoc, false, view_matrix); //send view matrix to the shaders

  // Set up the global rotate matrix. We will rotate every object by the global rotate matrix.
  globalRotateMatrix = mat4.rotate(
    globalRotateMatrix,
    mat4.identity(globalRotateMatrix),
    rotX,
    [1, 0, 0]
  );
  globalRotateMatrix = mat4.rotate(
    globalRotateMatrix,
    globalRotateMatrix,
    rotY,
    [0, 1, 0]
  );

  // Tower color
  gl.vertexAttrib3f(1, 0.75, 0.5, 0.33);
  // Tower shininess
  gl.vertexAttrib1f(3, 10);

  // Bottom of tower
  gl.bindVertexArray(cubeVAO);
  translate_matrix = mat4.translate(
    translate_matrix,
    mat4.identity(translate_matrix),
    [0, -0.5, 0]
  );
  scale_matrix = mat4.scale(scale_matrix, translate_matrix, [0.5, 0.2, 0.5]);
  model_matrix = mat4.multiply(model_matrix, globalRotateMatrix, scale_matrix);

  gl.uniformMatrix4fv(modelMatrixLoc, false, model_matrix); // send transform matrix to the shaders

  gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

  // Middle of tower
  translate_matrix = mat4.translate(
    translate_matrix,
    mat4.identity(translate_matrix),
    [0, 0, 0]
  );
  scale_matrix = mat4.scale(scale_matrix, translate_matrix, [0.4, 0.6, 0.4]);
  model_matrix = mat4.multiply(model_matrix, globalRotateMatrix, scale_matrix);

  gl.uniformMatrix4fv(modelMatrixLoc, false, model_matrix); // send transform matrix to the shaders
  gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

  // Top of tower
  translate_matrix = mat4.translate(
    translate_matrix,
    mat4.identity(translate_matrix),
    [0, 0.8, 0]
  );
  scale_matrix = mat4.scale(scale_matrix, translate_matrix, [0.3, 0.2, 0.3]);
  model_matrix = mat4.multiply(model_matrix, globalRotateMatrix, scale_matrix);

  gl.uniformMatrix4fv(modelMatrixLoc, false, model_matrix); // send transform matrix to the shaders
  gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

  // Peg
  translate_matrix = mat4.translate(
    translate_matrix,
    mat4.identity(translate_matrix),
    [0, 0.3, 0.5]
  );
  scale_matrix = mat4.scale(scale_matrix, translate_matrix, [0.02, 0.02, 0.2]);
  model_matrix = mat4.multiply(model_matrix, globalRotateMatrix, scale_matrix);

  gl.uniformMatrix4fv(modelMatrixLoc, false, model_matrix); // send transform matrix to the shaders
  gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

  // Draw the windmill blades
  gl.vertexAttrib3f(1, 1, 1, 1); //use a static vertex attribute (location == 1) to set the color to white
  gl.vertexAttrib1f(3, 5);

  // Blade 1
  translate_matrix = mat4.translate(
    translate_matrix,
    mat4.identity(translate_matrix),
    [0, 0.3, 0.55]
  );
  rotate_matrix = mat4.rotate(
    rotate_matrix,
    translate_matrix,
    localRotZ,
    [0.0, 0.0, 1.0]
  );
  scale_matrix = mat4.scale(scale_matrix, rotate_matrix, [0.15, 0.8, 0.02]);
  model_matrix = mat4.multiply(model_matrix, globalRotateMatrix, scale_matrix);

  gl.uniformMatrix4fv(modelMatrixLoc, false, model_matrix); //send model matrix to the shaders

  gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

  // Blade 2
  translate_matrix = mat4.translate(
    translate_matrix,
    mat4.identity(translate_matrix),
    [0, 0.3, 0.55]
  );
  rotate_matrix = mat4.rotate(
    rotate_matrix,
    translate_matrix,
    localRotZ + 1.5707,
    [0.0, 0.0, 1.0]
  );
  scale_matrix = mat4.scale(scale_matrix, rotate_matrix, [0.15, 0.8, 0.02]);
  model_matrix = mat4.multiply(model_matrix, globalRotateMatrix, scale_matrix);

  gl.uniformMatrix4fv(modelMatrixLoc, false, model_matrix); //send model matrix to the shaders

  gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
}

//return the WebGL context to the caller
function initModel(view) {
  gl = getGLContext(view);
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0.0, 0.0, view.width, view.height);
    gl.enable(gl.DEPTH_TEST); //turn on the depth test

    initProgram(); //load the shaders

    //Find the locations of the matrices in the shaders
    modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
    viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    initBuffers();
    initLights();
    rotX = 0;
    rotY = 0;
    localRotZ = 0;

    return gl;
  }
  return null;
}

function updateRotX(offset) {
  rotX += offset;
}

function updateRotY(offset) {
  rotY += offset;
}

function updateLocalRotZ(offset) {
  localRotZ += offset;
}

function resetModel() {
  offsetX = 0.1;
  offsetZ = 0.5;
}
