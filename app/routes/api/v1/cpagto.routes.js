module.exports = app => {

    //controllers
    const controller = require("../../../controllers/cpagto.controller.js");

    var router = require("express").Router();
    // Retrieve all published controller
    router.get("/", controller.findAll);

    // Retrieve a single data with id
    router.get("/:id", controller.findOne);

    app.use('/api/v1/cpagto', router);

};