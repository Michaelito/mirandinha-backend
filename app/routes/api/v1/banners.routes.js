const auth = require('../../../middleware/auth.js');
require("dotenv-safe").config();

module.exports = app => {

    //controllers
    const controller = require("../../../controllers/banners.controller.js");
    const auth = require("../../../middleware/auth.js");

    var router = require("express").Router();

    router.post("/", auth.authenticateToken, controller.create);


    app.use('/api/v1/banners', router);


};