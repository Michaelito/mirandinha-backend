const auth = require('../../../middleware/auth.js');
require("dotenv-safe").config();

module.exports = app => {

    //controllers
    const controller = require("../../../controllers/tutorial.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", auth.verifyJWT, controller.create);

    // Retrieve all controller
    router.get("/", controller.findAll);

    // Retrieve all published controller
    router.get("/published", controller.findAllPublished);

    // Retrieve a single Tutorial with id
    router.get("/:search", controller.findAllSubGroup);

    // Update a Tutorial with id
    router.put("/:id", controller.update);

    // Delete a Tutorial with id
    router.delete("/:id", controller.delete);

    // Delete all controller
    router.delete("/", controller.deleteAll);

    app.use('/api/v1/tutorial', router);


};