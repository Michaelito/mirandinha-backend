require("dotenv-safe").config();

module.exports = (app) => {
  //controllers
  const controller = require("../../../controllers/michaelcustomers_address.controller.js");
  
  var router = require("express").Router();

  router.post("/", controller.create);

  app.use("/api/v1/michael/customers_address", router);
};
