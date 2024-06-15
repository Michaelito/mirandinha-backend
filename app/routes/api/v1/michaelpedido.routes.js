require("dotenv-safe").config();


module.exports = (app) => {
  //controllers
  const controller = require("../../../controllers/michaelpedido.controller.js");

  var router = require("express").Router();

  router.post("/", controller.create);

  app.use("/api/v1/michael/pedidos", router);
};