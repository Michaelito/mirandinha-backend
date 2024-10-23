require("dotenv-safe").config();


module.exports = (app) => {
  //controllers
  const controller = require("../../../controllers/michaelpedido.controller.js");

  var router = require("express").Router();

  router.get("/", controller.findAll);

  router.get("/:id", controller.findOne);

  router.post("/accept-order", controller.accept_order);

  router.post("/", controller.create);

  router.put("/status/:id", controller.statusOrder);


  app.use("/api/v1/michael/pedidos", router);
};