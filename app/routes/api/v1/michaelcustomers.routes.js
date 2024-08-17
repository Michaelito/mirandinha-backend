require("dotenv-safe").config();

module.exports = (app) => {
  //controllers
  const controller = require("../../../controllers/michaelcustomers.controller.js");
  var router = require("express").Router();

  router.get("/", controller.findAll);

  router.get("/:id", controller.findOne);

  router.post("/", controller.create);

  router.put("/", controller.update);

  app.use("/api/v1/michael/customers", router);
};
