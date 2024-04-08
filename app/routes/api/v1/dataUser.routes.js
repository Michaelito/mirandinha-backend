module.exports = app => {

    //controllers
    const controller = require("../../../controllers/data_users.controller.js");

    var router = require("express").Router();

    // Retrieve all controller
    router.get("/", controller.findAll);

    // Retrieve a single data with id
    router.get("/:id", controller.findOne);

    // Create a new data
    router.post("/", controller.create);

    // Update a data with id
    router.put("/:id", controller.update);

    // Delete a data with id
    router.delete("/:id", controller.delete);

    app.use('/api/v1/dataUser', router);

};