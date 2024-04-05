module.exports = app => {

  //controllers

  const controller = require("../../../controllers/products.controller.js");

  var router = require("express").Router();

  // Retrieve all controller
  router.get("/", controller.findAll);

  // Retrieve a single Tutorial with id
  router.get("/:id", controller.findOne);
    
  app.use('/api/v1/products', router);


};