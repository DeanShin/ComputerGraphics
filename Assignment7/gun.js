//FileName:		pyramid.js
//Programmer:	Dan Cliburn
//Date:			9/24/2020
//Purpose:		This file defines the code for the pyramid

//This variables can be accessed in any function
let VAO, vertexPB;

//Set up the buffer and VAO we need for rendering the ground
function initGun(gl)
{
     //Vertex position data for the gun
  const positions = [ //gun outline
  ...[1.0, 1.5, 0.25],//v0
  ...[1.0, 1.5, 0.0],//v1
  ...[-1.0, 1.5, 0.25],//v2
  ...[-1.0, 1.5, 0.0],//v3
  ...[-1, 1.1, 0.25],//v4
  ...[-1, 1.1, 0], //v5
  ...[-0.75, 1.05, 0.25],//v6
  ...[-0.75, 1.05, 0], //v7
  ...[-1, 0.0, 0.25],//v8
  ...[-1, 0, 0], //v9
  ...[-0.5, 0, 0.25], //v10
  ...[-0.5, 0, 0], //v11
  ...[-0.30, 0.75, 0.25],//v12
  ...[-0.30, 0.75, 0],//v13
  ...[0, 0.9, 0.25],//v14
  ...[0, 0.9, 0],//v15
  ...[0.05, 1.1, 0.25],//v16
  ...[0.05, 1.1, 0],//v17
  ...[1, 1.1, 0.25],//v18
  ...[1, 1.1, 0],//v19
  ...[1, 1.5, 0.25],//v20
  ...[1, 1.5, 0],//v21 //gun fill
  ...[1, 1.1, 0],//v22
  ...[-1, 1.1, 0],//v23
  ...[-1, 1.5, 0],//v24
  ...[1, 1.5, 0],//v25//top slide fill
  ...[-1, 1.1, 0],//v26
  ...[-0.75, 1.05, 0],//v27
  ...[-0.3, 1.1, 0],//v28
  ...[-1, 0, 0],//v29
  ...[-0.2, 1.1, 0],//v30
  ...[-0.5, 0, 0],//v31
  ...[-0.2, 1.1, 0.25],//v32
  ...[-0.2, 1.1, 0.25],//v33
  ...[-1, 0, 0.25],//v34
  ...[-0.5, 0, 0.25],//v35
  ...[-0.75, 1.5, 0.25],//v36
  ...[-0.75, 1.5, 0.25],//v37
  ...[-1, 1.1, 0.25],//v38
  ...[1, 1.1, 0.25],//v39
  ...[1, 1.5, 0.25],//v40
  ...[-1, 1.5, 0.25],//v41
];

//Set up Vertex Array Object
VAO = gl.createVertexArray();
gl.bindVertexArray(VAO);


//Set up the VBO for the gun vertex positions 
vertexPB = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexPB);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0

//Clean
gl.bindVertexArray(null);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function drawGun(gl)
{
    var mat4 = glMatrix.mat4;
    var model_matrix = mat4.create();
    var model_matrix1 = mat4.create();

    var scale_matrix = mat4.create();
    var translate_matrix = mat4.create();
    var translate_matrix1 = mat4.create();

    var rotate_matrix = mat4.create();
    var rotate_matrix1 = mat4.create();

    //Bind the VAO for our pyramid
    gl.bindVertexArray(VAO);

    //TODO: change the shininess coefficient
    gl.vertexAttrib1f(3, 1); //use a static vertex attribute (location == 3) to set shininess for all polygons to 1.0

  //all triangles and points will have the same normal vector, so we will set it once with a static vertex attribute
  gl.vertexAttrib3f(2, 0, 0, 1); //use a static vertex attribute (location == 2) to set the normal vector


//   var scale_amount = [0.7, 0.7, 0.7];
//   scale_matrix = mat4.scale(scale_matrix, mat4.identity(scale_matrix), scale_amount);
//   var vec = [-1.5,5.2,-11.2]; //position of the gun in the scene
//   translate_matrix = mat4.translate(translate_matrix, mat4.identity(translate_matrix), vec);
//   var rotate_axis = [0.0, 1.0, 0.0];
//   rotate_matrix = mat4.rotate(rotate_matrix, translate_matrix, -1.8, rotate_axis); //NOTE: angle in radians
//   model_matrix = mat4.multiply(model_matrix, scale_matrix,rotate_matrix );

// //   vec = [rotY,2+rotY,3+rotZ]; //position of the gun in the scene
// //   translate_matrix1 = mat4.translate(translate_matrix1, mat4.identity(translate_matrix1), vec);
// //   model_matrix1 = mat4.multiply(model_matrix1, translate_matrix1, rotate_matrix);
// //   model_matrix = mat4.multiply(model_matrix, scale_matrix,model_matrix1 );
//  gl.uniformMatrix4fv(modelMatrixLoc, false, model_matrix); //send scale matrix to the shaders
  gl.vertexAttrib3f(0.1, 0.1, 0.1, 0); //use a static vertex attribute (location == 1) to set the color to black/grey
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 42);

    //Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

}