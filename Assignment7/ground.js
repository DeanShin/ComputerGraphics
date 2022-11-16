//FileName:		ground.js
//Programmer:	Dan Cliburn
//Date:			9/24/2020
//Purpose:		This file defines the code for our colored background model

//These variables can be accessed in any function
let groundVAO, wallVAO;

//Set up the buffer and VAO we need for rendering the ground
function initGround(gl) {
    //Vertex position data for the ground
    const positions = [-20.0, 0.0, -20.0,   //base
                        -20.0, 0.0, 20.0,
                        20.0, 0.0, -20.0,
                        20.0, 0.0, 20.0,
                        // -20.0, 20.0, -20.0, //back
                        // -20.0, 0.0, -20.0,
                        // 20.0, 20.0, -20.0,
                        // 20.0, 0.0, -20.0,
                        // 20.0, 20.0, 20.0, //front
                        // 20.0, 0.0, 20.0,
                        // -20.0, 20.0, 20.0,
                        // -20.0, 0.0, 20.0,
                        // 20.0, 20.0, -20.0, //right
                        // 20.0, 0.0, -20.0,
                        // 20.0, 20.0, 20.0,
                        // 20.0, 0.0, 20.0,
                        // -20.0, 20.0, 20.0, //left
                        // -20.0, 0.0, 20.0,
                        // -20.0, 20.0, -20.0,
                        // -20.0, 0.0, -20.0,
    ];
    const tex_coords = [0.0, 0.0,
        0.0, 5,
        5, 0.0,
        5, 5 ];
    //Set up Vertex Array Object for the ground
    groundVAO = gl.createVertexArray();
    gl.bindVertexArray(groundVAO);

    //Set up the VBO for the vertex positions 
    var vertexPB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPB);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0

    var tcBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);
    gl.vertexAttribPointer(4, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(4);
    //Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
function initWall(gl) {
    //Vertex position data for the ground
    const positions = [
                        -20.0, 20.0, -20.0, //back
                        -20.0, 0.0, -20.0,
                        20.0, 20.0, -20.0,
                        20.0, 0.0, -20.0,
                        20.0, 20.0, 20.0, //front
                        20.0, 0.0, 20.0,
                        -20.0, 20.0, 20.0,
                        -20.0, 0.0, 20.0,
                        20.0, 20.0, -20.0, //right
                        20.0, 0.0, -20.0,
                        20.0, 20.0, 20.0,
                        20.0, 0.0, 20.0,
                        -20.0, 20.0, 20.0, //left
                        -20.0, 0.0, 20.0,
                        -20.0, 20.0, -20.0,
                        -20.0, 0.0, -20.0,
    ];
    const tex_coords = [0.0, 0.0,
        0.0, 2,
        2, 0.0,
        2, 2 ];
    //Set up Vertex Array Object for the ground
    wallVAO = gl.createVertexArray();
    gl.bindVertexArray(wallVAO);

    //Set up the VBO for the vertex positions 
    var vertexPB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPB);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0

    var tcBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);
    gl.vertexAttribPointer(4, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(4);
    //Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

//We call drawGround to render the background model
function drawGround(gl) 
{  
    //bind the VAO for the ground
    gl.bindVertexArray(groundVAO);

    gl.vertexAttrib3f(1, 1, 1, 1); //use a static vertex attribute (location == 1) to set the color to green
    gl.vertexAttrib3f(2, 0, 1, 0); //use a static vertex attribute (location == 2) to set the normal vector
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); //floor
    //Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
function drawWall(gl, side) 
{   
    gl.bindVertexArray(wallVAO);
    switch (side) {
        case 1: {
            gl.vertexAttrib3f(1, 1, 1, 1); //use a static vertex attribute (location == 1) to set the color to green
            gl.vertexAttrib3f(2, 0, 1, 0); //use a static vertex attribute (location == 2) to set the normal vector
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); //wall
            gl.bindVertexArray(null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        break;
        }
        case 2: {
            gl.vertexAttrib3f(1, 1, 1, 1); //use a static vertex attribute (location == 1) to set the color to green
            gl.vertexAttrib3f(2, 0, 1, 0); //use a static vertex attribute (location == 2) to set the normal vector
            gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4); //wall
            gl.bindVertexArray(null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        break;
        }
        case 3: {
            gl.vertexAttrib3f(1, 1, 1, 1); //use a static vertex attribute (location == 1) to set the color to green
            gl.vertexAttrib3f(2, 0, 1, 0); //use a static vertex attribute (location == 2) to set the normal vector
            gl.drawArrays(gl.TRIANGLE_STRIP, 8, 4); //wall
            gl.bindVertexArray(null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        break;
        }
        case 4: {
            gl.vertexAttrib3f(1, 1, 1, 1); //use a static vertex attribute (location == 1) to set the color to green
            gl.vertexAttrib3f(2, 0, 1, 0); //use a static vertex attribute (location == 2) to set the normal vector
            gl.drawArrays(gl.TRIANGLE_STRIP, 12, 4); //wall
            gl.bindVertexArray(null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        break;
        }
    }
}