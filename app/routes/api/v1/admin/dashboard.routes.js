module.exports = (app) => {

  const controller = require("../../../../controllers/admin/dashboard.controller.js");
  const auth = require("../../../../middleware/auth.js");

  var router = require("express").Router();

  // Retrieve all controller

  router.get("/", auth.authenticateToken, controller.findAll);

  app.use("/api/v1/admin/dashboard", router);
};
