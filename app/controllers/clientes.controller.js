const db = require("../models");
const Clientes = db.clientes;
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;


// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const nome = req.query.nome;
    var condition = nome ? {
        nome: {
            [Op.like]: `%${nome}%`
        }
    } : null;

    Clientes.findAll({ where: condition })
        .then(data => {
            res.send({
                status: true,
                message: "The request has succeeded",
                data: {
                    clientes: data
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

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Clientes.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Data with id=" + id
            });
        });
};
