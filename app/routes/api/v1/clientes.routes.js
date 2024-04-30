const auth = require('../../../middleware/auth.js');
require("dotenv-safe").config();

module.exports = app => {

    //controllers
    const controller = require("../../../controllers/clientes.controller.js");

    var router = require("express").Router();

    // Retrieve all controller
    router.get("/", controller.findAll);
    router.get("/", controller.create);

    // Retrieve a single Tutorial with id
    router.get("/:id", controller.findOne);

    app.use('/api/v1/clientes', router);


};