const db = require("../models");
const Grupo = db.grupo;
const Op = db.Sequelize.Op;
const { uuid } = require('uuidv4');

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