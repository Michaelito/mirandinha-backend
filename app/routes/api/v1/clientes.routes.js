const auth = require('../../../middleware/auth.js');
require("dotenv-safe").config();

module.exports = app => {

    //controllers
    const controller = require("../../../controllers/clientes.controller.js");
    const auth = require("./../../../middleware/auth.js");

    var router = require("express").Router();

    router.post("/", auth.authenticateToken, controller.create);
    // Retrieve all controller
    router.get("/", auth.authenticateToken, controller.findAll);

    // Retrieve a single Tutorial with id
    router.get("/:id", auth.authenticateToken, controller.findOne);

    // Update a Data with id
    router.put("/:id", auth.authenticateToken, controller.update);

    app.use('/api/v1/clientes', router);


};