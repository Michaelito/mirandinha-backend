const db = require("../models");
const Products = db.product;
const Op = db.Sequelize.Op;
const { uuid } = require('uuidv4');

exports.findAll = (req, res) => {
    const nome = req.query.nome;
    var condition = nome ? {
        title: {
            [Op.nome]: `%${nome}%`
        }
    } : null;

    Products.findAll({ where: condition })
        .then(data => {
            res.send({
                status: true,
                message: "The request has succeeded",
                data: {
                    products: data
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

    Products.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Data with id=" + id
            });
        });
};

