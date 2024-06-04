module.exports = app => {

    //controllers
    const controller = require("../../../controllers/grupo_format.controller.js");

    var router = require("express").Router();

    // Retrieve all controller
    router.get("/", controller.findAll);

    // Retrieve a single Data with id
    router.get("/:id", controller.findOne);

    router.post("/", controller.create);

    router.put("/:id", controller.update);

    app.use('/api/v1/grupo_format', router);


};