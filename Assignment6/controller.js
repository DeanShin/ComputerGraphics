//FileName:		controller.js
//Programmer:	Dan Cliburn, Dean Shin
//Date:			10/26/2020
//Purpose:		This file defines the code for our controller
//The "controller" runs the program and handles events.

let model;
let view; //the "view" is our Canvas
let timer;

function checkKey(event) {
  switch (event.keyCode) {
    //left arrow key was pressed (37 in ASCII)
    case 37: {
      updateRotY(0.1); //defined in model.js
      break;
    }

    //up arrow key was pressed (38 in ASCII)
    case 38: {
      updateRotX(0.1); //defined in model.js
      break;
    }

    //right arrow key was pressed (39 in ASCII)
    case 39: {
      updateRotY(-0.1); //defined in model.js
      break;
    }

    //down arrow key was pressed (40 in ASCII)
    case 40: {
      updateRotX(-0.1); //defined in model.js
      break;
    }

    // 1 key was pressed (49 in ASCII)
    case 49: {
      if (timer == null) {
        timer = setInterval(() => {
          updateLocalRotZ(0.1);
          drawModel();
        }, 100);
      } else {
        clearInterval(timer);
        timer = null;
      }
    }

    //ESC key was pressed
    case 27: {
      resetModel(); //defined in model.js
    }
  }
  //redraw the scene so that we can see changes
  drawModel(); //defined in model.js
}

function controller() {
  //set up the view and the model
  view = initView(); //initView is defined in view.js
  model = initModel(view); //initModel is defined in model.js

  if (model) {
    alert(
      "Use left and right to rotate around the y axis. Use up and down to rotate around the x axis. Use 1 to toggle animations."
    );
    //make sure everything got initialized before proceeding
    drawModel(); // defined in model.js
    window.onkeydown = checkKey; //call checkKey whenever a key is pressed
  } else {
    alert("Could not initialize the view and model");
  }
}
