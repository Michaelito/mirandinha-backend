
module.exports = app => {

    //controllers
    const controller = require("../../../controllers/produtos_grade.controller.js");

    var router = require("express").Router();

    // Create a new Data
    router.post("/",controller.create);

    // Retrieve all controller
    router.get("/", controller.findAll);

    // Retrieve a single Data with id
    router.get("/:id", controller.findOne);

    // Update a Data with id
    router.put("/:id", controller.update);

    // Delete a Data with id
    router.delete("/:id", controller.delete);

    // Delete all controller
    router.delete("/", controller.deleteAll);

    app.use('/api/v1/produtos_grade', router);


};