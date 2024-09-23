module.exports = app => {

    //controllers
    const controller = require("../../../controllers/motoboy.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", controller.create);

    // Retrieve all controller
    router.get("/",controller.findAll);

    // Retrieve a single Tutorial with id
    router.get("/:id", controller.findOne);

    // Update a Tutorial with id
    router.put("/:id", controller.update);

    app.use('/api/v1/motoboy', router);


};