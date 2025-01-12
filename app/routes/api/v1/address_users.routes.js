module.exports = app => {

    //controllers
    const controller = require("../../../controllers/address_users.controller.js");
    const auth = require("./../../../middleware/auth.js");

    var router = require("express").Router();

    // Retrieve all controller
    router.get("/", auth.authenticateToken, controller.findAll);

    // Retrieve a single data with id
    router.get("/:id", auth.authenticateToken, controller.findOne);

    // Create a new data
    router.post("/", auth.authenticateToken, controller.create);

    // Update a data with id
    router.put("/:id", auth.authenticateToken, controller.update);

    // Delete a single data with id
    router.delete("/:id", auth.authenticateToken, controller.delete);


    app.use('/api/v1/address_users', router);

};