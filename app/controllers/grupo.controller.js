const db = require("../models");
const Grupo = db.grupo;
const Op = db.Sequelize.Op;
const { uuid } = require('uuidv4');


exports.findAll = (req, res) => {

    Grupo.findAll()
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

// Find a single Grupo with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Grupo.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Grupo with id=" + id
            });
        });
};