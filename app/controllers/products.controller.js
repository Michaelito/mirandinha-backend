const db = require("../models");
const Products = db.product;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
  const nome = req.query.nome;
  var condition = nome
    ? {
        nome: {
          [Op.like]: `%${nome}%`,
        },
      }
    : null;

  Products.findAll({ where: condition })
    .then((data) => {
      res
        .send({
          status: true,
          message: "The request has succeeded",
          data: {
            products: data,
          },
        })
        .status(200);
    })
    .catch((err) => {
      res
        .send({
          status: false,
          message: "The request has not succeeded",
          data: null,
        })
        .status(500);
    });
};

exports.findAllGroup = (req, res) => {
  const id = req.params.id;

  console.log(id);

  Products.findAll({ where: { id_grupo1: id } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Products.findByPk(id)
    .then((data) => {
      res.send({
        status: true,
        message: "The request has succeeded",
        data: {
          product: data,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Data with id=" + id,
      });
    });
};


