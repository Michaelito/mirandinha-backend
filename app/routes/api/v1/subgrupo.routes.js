module.exports = (app) => {
  //controllers
  const controller = require("../../../controllers/subgrupo.controller.js");

  var router = require("express").Router();

  router.get("/:id", controller.findOne);

  app.use("/api/v1/subgrupo", router);
};
