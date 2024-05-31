const db = require("../models");
const GrupoFormat = db.grupo_format;
const Op = db.Sequelize.Op;
const { uuid } = require('uuidv4');

// Create and Save a new GrupoFormat
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a GrupoFormat
    const payload = {
        uuid: uuid(),
        name: req.body.name
    };

    // Save GrupoFormat in the database
    GrupoFormat.create(payload)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the GrupoFormat."
            });
        });
};

// Retrieve all GrupoFormats from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? {
        name: {
            [Op.like]: `%${name}%`
        }
    } : null;

    GrupoFormat.findAll({ where: condition })
        .then(data => {
            res.send({
                status: true,
                message: "The request has succeeded",
                data: {
                    Grupos: data
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

