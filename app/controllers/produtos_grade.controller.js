const db = require("../models");
const Cores = db.produtos_grade;
const Op = db.Sequelize.Op;
const { uuid } = require("uuidv4");

// Create and Save a new Data
exports.create = (req, res) => {

  // Create a Data
  const payload = {
    uuid: uuid(),
    produto_id: req.body.produto_id,
    cores: req.body.cores,
    hexadecimal: req.body.hexadecimal,
    img: req.body.img,
    quantidade: req.body.quantidade,
  };

  // Save Data in the database
  Cores.create(payload)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Data.",
      });
    });
};

// Retrieve all Datas from the database.
exports.findAll = (req, res) => {
  const cores_id = req.query.cores_id;
  var condition = cores_id
    ? {
        cores_id: {
          [Op.like]: `%${cores_id}%`,
        },
      }
    : null;

  Cores.findAll({ where: condition })
    .then((data) => {
      res
        .send({
          status: true,
          message: "The request has succeeded",
          data: {
            tutorial: data,
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

  Cores.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Data with id=" + id,
      });
    });
};

// Update a Data by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Cores.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Data was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Data with id=${id}. Maybe Data was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Data with id=" + id,
      });
    });
};

// Delete a Data with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Cores.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Data was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Data with id=${id}. Maybe Data was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Data with id=" + id,
      });
    });
};

// Delete all Datas from the database.
exports.deleteAll = (req, res) => {
  Cores.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Datas were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};
