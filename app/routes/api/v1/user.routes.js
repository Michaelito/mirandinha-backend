require("dotenv-safe").config();

module.exports = app => {

    //controllers
    const controller = require("../../../controllers/user.controller.js");
    const auth = require("./../../../middleware/auth.js");

    var router = require("express").Router();

    // Retrieve all controller
    router.get("/", auth.authenticateToken, controller.findAll);

    // Retrieve a single data with id
    router.get("/:id", auth.authenticateToken, controller.findOne);

    // Create a new data
    router.post("/", auth.authenticateToken, controller.create);

    router.post("/forgot_password", controller.forgot_password);

    // Create a new data
    router.put("/update_password/:id", auth.authenticateToken, controller.update_password);

    // Update a data with id
    router.put("/:id", auth.authenticateToken, controller.update);

    // Delete a data with id
    router.delete("/:id", auth.authenticateToken, controller.delete);

    app.use('/api/v1/users', router);


};