const db = require("../models");
const Produtos = db.michaelprodutos;
const Op = db.Sequelize.Op;
const { uuid } = require("uuidv4");

// Create and Save a new Data
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "The name field cannot be empty!",
    });
    return;
  }

  // Create a Data
  const json = {
    uuid: uuid(),
    group_id: req.body.group_id,
    name: req.body.name,
    descricao: req.body.descricao,
    img: req.body.img,
    valor: req.body.valor,
    estoque: req.body.estoque,
    estoque_minimo: req.body.estoque_minimo,
    order: req.body.order
  };

  // Save Tutorial in the database
  Produtos.create(json)
    .then((data) => {
      res.status(200).send({
        status: true,
        message: "The request has succeeded",
        data: {
          Produtos: data,
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all Datas from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = {
    status: 1
  };

  if (name) {
    condition.name = {
      [Op.like]: `%${name}%`
    };
  }

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

  Produtos.findAll({ where: { group_id: id, status: 1 } })
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
