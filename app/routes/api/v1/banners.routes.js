const auth = require('../../../middleware/auth.js');
require("dotenv-safe").config();

module.exports = app => {

    //controllers
    const controller = require("../../../controllers/banners.controller.js");
    const auth = require("../../../middleware/auth.js");

    var router = require("express").Router();

    router.get("/", auth.authenticateToken, controller.findAll);

    router.post("/", auth.authenticateToken, controller.create);

    router.put("/:id", auth.authenticateToken, controller.update);

    app.use('/api/v1/banners', router);


};