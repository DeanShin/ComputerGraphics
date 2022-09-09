//FileName:		model.js
//Programmer:   Dan Cliburn & Dean Shin & Chris C. & Chris S.
//Date:         9/7/2022
//Purpose:		This file defines the code for our WebGL 2 model
//The "model" is all of the WebGL2 code that draws our graphics scene

//these variables can be accessed in any function
let gl;
let program;
let vertexBuffer;
let vertexColorBuffer;
let triangleCount;

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
  //array data for the triangles
  const vertices = [
    // Leaves
    ...[...[0, 0.35, 0], ...[-0.65, -0.25, 0], ...[0.65, -0.25, 0]],
    ...[...[0, 0.55, 0], ...[-0.5, 0.1, 0], ...[0.5, 0.1, 0]],
    ...[...[0, 0.7, 0], ...[-0.35, 0.4, 0], ...[0.35, 0.4, 0]],
    // Star
    ...[...[0, 0.8, 0], ...[-0.02, 0.7, 0.0], ...[0.02, 0.7, 0.0]],
    ...[...[-0.1, 0.7, 0], ...[0, 0.68, 0.0], ...[0, 0.72, 0.0]],
    ...[...[0, 0.6, 0], ...[0.02, 0.7, 0.0], ...[-0.02, 0.7, 0.0]],
    ...[...[0.1, 0.7, 0], ...[0, 0.72, 0.0], ...[0, 0.68, 0.0]],
    // Trunk
    ...[...[-0.3, -0.25, 0], ...[-0.3, -1.0, 0], ...[0.3, -1, 0]],
    ...[...[-0.3, -0.25, 0], ...[0.3, -1, 0], ...[0.3, -0.25, 0]],
    // Ornaments
    ...[...[0.15, -0.05, 0], ...[0.2, 0, 0], ...[0.1, 0, 0]],
    ...[...[0.15, 0.05, 0], ...[0.1, 0, 0], ...[0.2, 0, 0]],
    ...[...[0.1, 0.45, 0], ...[0.15, 0.5, 0], ...[0.05, 0.5, 0]],
    ...[...[0.1, 0.55, 0], ...[0.05, 0.5, 0], ...[0.15, 0.5, 0]],
    ...[...[-0.15, 0.25, 0], ...[-0.1, 0.2, 0], ...[-0.2, 0.2, 0]],
    ...[...[-0.15, 0.15, 0], ...[-0.2, 0.2, 0], ...[-0.1, 0.2, 0]],
    ...[...[-0.25, -0.1, 0], ...[-0.2, -0.15, 0], ...[-0.3, -0.15, 0]],
    ...[...[-0.25, -0.2, 0], ...[-0.3, -0.15, 0], ...[-0.2, -0.15, 0]],
    // Birdhouse
    ...[...[-0.2, -0.5, 0], ...[-0.2, -0.75, 0], ...[0.2, -0.75, 0]],
    ...[...[-0.2, -0.5, 0], ...[0.2, -0.75, 0], ...[0.2, -0.5, 0]],
    ...[...[-0.1, -0.63, 0], ...[0, -0.7, 0], ...[0, -0.55, 0]],
    ...[...[0.1, -0.63, 0], ...[0, -0.7, 0], ...[0, -0.55, 0]],
  ];
  const colors = [
    // Leaves
    ...[...[0.0, 0.8, 0.0], ...[0.0, 0.4, 0.2], ...[0.0, 0.4, 0.2]],
    ...[...[0.0, 0.8, 0.0], ...[0.0, 0.4, 0.2], ...[0.0, 0.4, 0.2]],
    ...[...[0.0, 0.8, 0.0], ...[0.0, 0.4, 0.2], ...[0.0, 0.4, 0.2]],
    // Star
    ...[...[0.75, 0.75, 0], ...[0.75, 0.75, 0], ...[0.75, 0.75, 0]],
    ...[...[0.75, 0.75, 0], ...[0.75, 0.75, 0], ...[0.75, 0.75, 0]],
    ...[...[0.75, 0.75, 0], ...[0.75, 0.75, 0], ...[0.75, 0.75, 0]],
    ...[...[0.75, 0.75, 0], ...[0.75, 0.75, 0], ...[0.75, 0.75, 0]],
    // Trunk
    ...[
      ...[0.2294117647, 0.11529411764, 0],
      ...[0.2294117647, 0.11529411764, 0],
      ...[0.2294117647, 0.11529411764, 0],
    ],
    ...[
      ...[0.2294117647, 0.11529411764, 0],
      ...[0.2294117647, 0.11529411764, 0],
      ...[0.2294117647, 0.11529411764, 0],
    ],
    // Ornaments
    ...[...[1.0, 0, 0], ...[1.0, 0, 0], ...[1.0, 0, 0]],
    ...[...[1.0, 0, 0], ...[1.0, 0, 0], ...[1.0, 0, 0]],
    ...[...[0, 1.0, 0], ...[0, 1.0, 0], ...[0, 1.0, 0]],
    ...[...[0, 1.0, 0], ...[0, 1.0, 0], ...[0, 1.0, 0]],
    ...[...[0, 0, 1.0], ...[0, 0, 1.0], ...[0, 0, 1.0]],
    ...[...[0, 0, 1.0], ...[0, 0, 1.0], ...[0, 0, 1.0]],
    ...[...[1.0, 0, 1.0], ...[1.0, 0, 1.0], ...[1.0, 0, 1.0]],
    ...[...[1.0, 0, 1.0], ...[1.0, 0, 1.0], ...[1.0, 0, 1.0]],
    // Birdhouse
    ...[...[0, 0, 1], ...[0, 0, 1], ...[0, 0, 1]],
    ...[...[0, 0, 1], ...[0, 0, 1], ...[0, 0, 1]],
    ...[...[1, 0, 0], ...[1, 0, 0], ...[1, 0, 0]],
    ...[...[1, 0, 0], ...[1, 0, 0], ...[1, 0, 0]],
  ];

  triangleCount = 21;

  //Setting up the VBO for the triangle vertex positions
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  //Setting up the VBO for the triangle vertex colors
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  //Clean
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

//We call drawModel to render to our canvas
//This function is similar to the draw() function defined in the section "Time for Action: Rendering a Square" of the textbook
function drawModel() {
  //Clear the scene
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  //Use the buffers we've constructed - first the vertex positions
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // This 0 corresponds to layout (location = 0) in vec4 vPosition;
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  //Now the vertex colors
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  // This 1 corresponds to layout (location = 1) in vec4 vColor;
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(1);

  //Draw to the scene using triangle primitives
  gl.drawArrays(gl.TRIANGLES, 0, triangleCount * 3);

  //Clean
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

//return the WebGL context to the caller
function initModel(view) {
  gl = getGLContext(view);
  if (gl) {
    gl.clearColor(0.5, 0.5, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0.0, 0.0, view.width, view.height);

    initProgram();
    initBuffers();

    return gl;
  }
  return null;
}
