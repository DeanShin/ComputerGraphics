//FileName:		controller.js
//Programmer:     Dan Cliburn, Dean S, Chris C, Chris S
//Date:           10/03/2020
//Purpose:		This file defines the code for our controller
//The "controller" runs the program and handles events.

let model;
let view; //the "view" is our Canvas
let timer; //used for Task 3 in the lab

function checkKey(event) {
  switch (event.keyCode) {
    //left arrow key was pressed (37 in ASCII)
    case 37: {
      updateModelX(-0.1); //defined in model.js
      break;
    }

    //up arrow key was pressed (38 in ASCII)
    case 38: {
      updateModelY(0.1); //defined in model.js
      break;
    }

    //right arrow key was pressed (39 in ASCII)
    case 39: {
      updateModelX(0.1); //defined in model.js
      break;
    }

    //down arrow key was pressed (40 in ASCII)
    case 40: {
      updateModelY(-0.1); //defined in model.js
      break;
    }

    //ESC key was pressed
    case 27: {
      resetModel(); //defined in model.js
    }
    case 49: {
      turnLightOff();
      break;
  }

    case 50 : {
        turnLightOn();
        break;
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
    //make sure everything got initialized before proceeding
    drawModel(); // defined in model.js
    window.onkeydown = checkKey; //call checkKey whenever a key is pressed
  } else {
    alert("Could not initialize the view and model");
  }
}
