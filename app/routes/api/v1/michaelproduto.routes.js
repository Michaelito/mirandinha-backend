module.exports = app => {

    //controllers
    const controller = require("../../../controllers/michaelproduto.controller.js");

    var router = require("express").Router();

    // Retrieve all controller
    router.get("/", controller.findAll,);

    // Retrieve a single Tutorial with id
    router.get("/:id", controller.findOne);

    // Retrieve all controller
    router.get("/group/:id", controller.findAllGroup);

    app.use('/api/v1/michael/produtos', router);


};