//FileName:		controller.js
//Programmer:	Dan Cliburn
//Date:			8/11/2020
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
      //TODO: add code here to call updateModelY
      updateModelY(0.1);
      break;
    }

    //right arrow key was pressed (39 in ASCII)
    case 39: {
      updateModelX(0.1); //defined in model.js
      break;
    }

    //down arrow key was pressed (40 in ASCII)
    case 40: {
      //TODO: add code here to call updateModelY
      updateModelY(-0.1);
      break;
    }

    //ESC key was pressed
    case 27: {
      clearInterval(timer); //turn our timer off
      break;
    }

    case 49: {
      clearInterval(timer); // turn timer off
      timer = setInterval(animate, 100);
      break;
    }

    case 50: {
      updateModelX(-xOffset);
      updateModelY(-yOffset);
    }
  }
  //redraw the scene so that we can see changes
  drawModel(); //defined in model.js
}

function animate() {
  //TODO: call updateModelY(-0.01); //to add a gravity effect
  updateModelY(-0.01);

  drawModel(); //Note that the model needs to be redrawn to see the effects
}

function controller() {
  //set up the view and the model
  view = initView(); //initView is defined in view.js
  model = initModel(view); //initModel is defined in model.js

  if (model) {
    //make sure everything got initialized before proceeding
    drawModel(); // defined in model.js

    //TODO: For task three you want to add in the line below
    timer = setInterval(animate, 100); //call the animate function every 100 milliseconds
    window.onkeydown = checkKey; //call checkKey whenever a key is pressed
  } else {
    alert("Could not initialize the view and model");
  }
}
