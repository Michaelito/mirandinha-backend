module.exports = app => {

    //controllers
    const controller = require("../../../controllers/grupo_format.controller.js");

    var router = require("express").Router();

    // Retrieve all controller
    router.get("/", controller.findAll);

    router.post("/", controller.create);

    app.use('/api/v1/grupo_format', router);


};