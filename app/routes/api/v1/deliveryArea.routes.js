module.exports = app => {

    //controllers
    const controller = require("../../../controllers/deliveryArea.controller.js");

    var router = require("express").Router();

    // Create a new Data
    router.post("/", controller.create);

    // Retrieve all controller
    router.get("/",controller.findAll);

    // Retrieve a single Data with id
    router.get("/:id", controller.findOne);

    // Update a Data with id
    router.put("/:id", controller.update);

    app.use('/api/v1/deliveryArea', router);


};