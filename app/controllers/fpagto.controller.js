const db = require("../models");
const Fpagto = db.fpagto;

exports.findAll = (req, res) => {

    Fpagto.findAll()
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

// Find a single Fpagto with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    console.log(req.params);

    Fpagto.findByPk(id)
        .then(data => {
            res.send(data);

        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Fpagto with id=" + ids
            });
        });
};