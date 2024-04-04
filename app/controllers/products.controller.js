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

