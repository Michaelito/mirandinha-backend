require("dotenv-safe").config();

module.exports = (app) => {
  //controllers
  const controller = require("../../../controllers/exsam.controller.js");

  var router = require("express").Router();

  // Retrieve all controller
  router.get("/", controller.findAll);

  router.post("/cliente", controller.createClient);

  router.get("/updateData", controller.updateData);

  app.use("/api/v1/exsam", router);
};
