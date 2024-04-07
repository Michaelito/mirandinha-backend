const db = require("../models");
const Cpagto = db.cpagto;

exports.findAll = (req, res) => {

    Cpagto.findAll()
        .then(data => {
            res.send({
                status: true,
                message: "The request has succeeded",
                data: {
                    tutorial: data
                }
            }).status(200);
        })
        .catch(err => {
            res.send({
                status: false,
                message: "The request has not succeeded",
                data: null
            }).status(500);
        });
};

// Find a single Cpagto with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    console.log(req.params);

    Cpagto.findByPk(id)
        .then(data => {
            res.send(data);

        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Cpagto with id=" + ids
            });
        });
};