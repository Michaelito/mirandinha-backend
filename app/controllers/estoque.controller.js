const db = require("../models");
const estoque = db.estoque;
const produtos = db.produtos;
const { uuid } = require('uuidv4');
const Op = db.Sequelize.Op;

//Retrieve all from the database.
exports.findAll = (req, res) => {

    const id = req.query.id;
    estoque.hasOne(produtos, {
        foreignKey: 'id'
    });
    var condition = id ? {
        id: {
            [Op.like]: `%${id}%`
        }
    } : null;

    estoque.findAll({
        where: condition,
        include: [
            {
                model: produtos,
                required: false,
            }
        ]
    })
        .then(data => {
            res.send({
                status: true,
                message: "The request has succeeded",
                data: {
                    Estoques: data
                }
            }).status(200);
        })
        .catch(err => {
            res.send({
                status: false,
                message: err + "The request has not succeeded",
                data: null
            }).status(500);
        });
};

// Find a single Data with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    estoque.hasOne(produtos, {
        foreignKey: 'id'
    });

    estoque.findByPk(id, {
        include: [
            {
                model: produtos,
                required: false,
            }
        ]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err + "Error retrieving Data with id=" + id
            });
        });
};

