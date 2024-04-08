require("dotenv-safe").config();


module.exports = app => {

    //controllers
    const controller = require("../../../controllers/pedidos.controller.js");

    var router = require("express").Router();

    // Retrieve all controller
    router.get("/", controller.findAll);

    // Retrieve a single Tutorial with id
    router.get("/:id", controller.findOne);

    router.post("/", controller.create);

    app.use('/api/v1/pedidos', router);


};