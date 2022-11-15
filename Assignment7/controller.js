//FileName:		controller.js
//Programmer:	Dan Cliburn
//Date:			9/22/2020
//Purpose:		This file defines the code for our controller
//The "controller" runs the program and handles events.
//alert("- Hit 'f' to enter Fullscreen Mode \n- Click the left mouse button to lock the aim/cursor \n- Move the Mouse to aim/look around scene \n- Use 'wasd' to control the player movement \n- Press '1' to reset the scene");
let model;
let view; //the "view" is our Canvas
let timer; //used for Task 3 in the lab
let pressedKeys = {};


function checkKey(event) {
    switch (event.keyCode) {
        //left arrow key was pressed (37 in ASCII)
        case 65: {
            updateEyeX(-0.2); //defined in model.js
            break;
        }

        //up arrow key was pressed (38 in ASCII)
        case 87: {
            updateEye(0.2); //defined in model.js
            break;
        }

        //right arrow key was pressed (39 in ASCII)
        case 68: {
            updateEyeX(0.2); //defined in model.js
            break;
        }

        //down arrow key was pressed (40 in ASCII)
        case 83: {
            updateEye(-0.2); //defined in model.js
            break;
        }

        //1 key was pressed
        case 49: {
            resetModel(); //defined in model.js
        }
    }
    //redraw the scene so that we can see changes
    drawModel(); //defined in model.js
}

function checkMouse(event) {

    var x = event.movementX ;
    var y = event.movementY ;
    updateRotY(x/80);
    updateRotZ(y/80);

    drawModel();
    
}
function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
      console.log('The pointer lock status is now locked');
    } else {
      console.log('The pointer lock status is now unlocked');
    }
  }

  function toggleFullScreen() {
    if(canvas.requestFullscreen) {
        canvas.requestFullscreen();
      }else if (canvas.mozRequestFullScreen) {
        canvas.mozRequestFullScreen();     // Firefox
      }else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();  // Safari
      }else if(canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();      // IE/Edge
      }
    else if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
  }
function controller() {
    //set up the view and the model
    view = initView();  //initView is defined in view.js
    model = initModel(view); //initModel is defined in model.js
    
    if (model) //make sure everything got initialized before proceeding
    {
        canvas.requestPointerLock = canvas.requestPointerLock ||   canvas.mozRequestPointerLock;
        document.exitPointerLock = document.exitPointerLock ||  document.mozExitPointerLock;
        drawModel(); // defined in model.js
        canvas.addEventListener('mousemove', checkMouse, true );
        window.onkeydown = checkKey; //call checkKey whenever a key is pressed
        canvas.onclick = () => {
            canvas.requestPointerLock();
          }
          document.addEventListener('pointerlockchange', lockChangeAlert, false);
          document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

        document.addEventListener("keyup", function(event) {
            if (event.key === 'f') {
              toggleFullScreen();
            }
          }, false);  

        document.addEventListener("keydown", function(event) {
         if (event.key === 'Shift') {
                aimDownSights(true);
            }   
        }, false);  
        document.addEventListener("keyup", function(event) {
        if (event.key === 'Shift') {
                aimDownSights(false);
            }   
        }, false);  

    }
    else
    {
        alert('Could not initialize the view and model');
    }
}