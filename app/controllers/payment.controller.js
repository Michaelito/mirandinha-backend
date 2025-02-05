const db = require("../models");
const Payment = db.payment;
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require("uuid");

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Create a Tutorial
  const tutorial = {
    uuid: uuidv4(),
    name: req.body.name,
    img: req.body.img,
  };

  // Save Tutorial in the database
  Payment.create(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const nome = req.query.nome;

  var condition = {};

  if (nome) {
    condition = {
      [Op.or]: [
        { nome: { [Op.like]: `%${nome}%` } },
        //{ id_exsam: { [Op.like]: `%${nome}%` } },
      ],
    };
  }

  Payment.findAll({ where: condition })
    .then((data) => {
      res.send({
        status: true,
        message: "The request has succeeded",
        data: {
          payments: data,
        },
      });
    })
    .catch((err) => {
      res.send({
        status: false,
        message: "The request has not succeeded",
        data: null,
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  Payment.findByPk(id)
    .then((data) => {
      if (!data) {
        return res.status(200).send({
          message: "Product not found with id=" + id,
        });
      }

      res.send({
        status: true,
        message: "The request has succeeded",
        data: {
          payment: data,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "Error retrieving Product with id=" + id,
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Payment.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tutorial was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Data with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Data with id=" + id,
      });
    });
};

