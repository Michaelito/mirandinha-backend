module.exports = (app) => {
  //controllers
  const controller = require("../../../controllers/subgrupo.controller.js");

  var router = require("express").Router();

  // Retrieve all controller
  router.get("/", controller.findAll);

  router.get("/", controller.findOne);

  router.post("/", controller.create);

  app.use("/api/v1/subgrupo", router);
};
