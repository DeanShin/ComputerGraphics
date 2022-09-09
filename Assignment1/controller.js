//FileName:		controller.js
//Programmer:   Dan Cliburn & Dean Shin & Chris C. & Chris S.
//Date:         9/7/2022
//Purpose:		This file defines the code for our controller
//The "controller" runs the program and handles events.

let model;
let view; //the "view" is our Canvas

function controller() {
  //set up the view and the model
  view = initView(); //initView is defined in view.js
  model = initModel(view); //initModel is defined in model.js

  if (model) {
    //make sure everything got initialized before proceeding
    drawModel(); // defined in model.js
  } else {
    alert("Could not initialize the view and model");
  }
}
