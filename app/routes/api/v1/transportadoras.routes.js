module.exports = app => {

    //controllers
    const controller = require("../../../controllers/transportadoras.controller.js");

    var router = require("express").Router();

    // Retrieve all controller
    router.get("/", controller.findAll);

    router.get("/:search", controller.findAll);

    app.use('/api/v1/transportadoras', router);


};