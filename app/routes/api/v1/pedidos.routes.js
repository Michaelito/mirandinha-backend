require("dotenv-safe").config();


module.exports = (app) => {
  //controllers
  const controller = require("../../../controllers/pedidos.controller.js");
  const auth = require("./../../../middleware/auth.js");

  var router = require("express").Router();

  // Retrieve all controller
  router.get("/erp", controller.findAllErp);

  router.get("/", auth.authenticateToken, controller.findAll);

  // Retrieve all controller
  router.get("/user", auth.authenticateToken, controller.findAllUser);

  // Retrieve a single Tutorial with id
  router.get("/:id", auth.authenticateToken, controller.findOne);

  router.post("/reprocess", auth.authenticateToken, controller.reprocess);

  router.post("/", auth.authenticateToken, controller.create);

  router.put("/:id", auth.authenticateToken, controller.updateById);

  app.use("/api/v1/pedidos", router);
};