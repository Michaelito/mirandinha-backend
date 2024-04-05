module.exports = app => {

    //controllers
    const controller = require("../../../controllers/fpagto.controller.js");

    var router = require("express").Router();


    // Retrieve a single data with id
    router.get("/:id", controller.findOne);

    app.use('/api/v1/fpagto', router);

};