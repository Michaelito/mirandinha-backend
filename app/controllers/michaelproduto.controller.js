const db = require("../models");
const Produtos = db.michaelprodutos;
const Op = db.Sequelize.Op;

// Retrieve all Datas from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name
    ? {
        name: {
          [Op.like]: `%${name}%`,
        },
      }
    : null;

  Produtos.findAll({ where: condition })
    .then((data) => {
      res
        .send({
          status: true,
          message: "The request has succeeded",
          data: {
            Produtos: data,
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

// Find a single Data with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Produtos.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Data with id=" + id,
      });
    });
};

exports.findAllGroup = async (req, res) => {

  const id = req.params.id;

  Produtos.findAll({ where: {group_id: id} })
    .then((data) => {
      res
        .send({
          status: true,
          message: "The request has succeeded",
          data: {
            Produtos: data,
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

