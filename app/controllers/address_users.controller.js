const db = require("../models");
const address_users = db.address_users;
const Op = db.Sequelize.Op;
const { uuid } = require('uuidv4');
const axios = require("axios");
const objValidation = require('../validation/address_users_validation');


// Create and Save a new Tutorial

// Retrieve all from the database.
exports.findAll = (req, res) => {
    const cep = req.query.cep;
    var condition = cep ? {
        cep: {
            [Op.like]: `%${cep}%`
        }
    } : null;

    address_users.findAll({ where: condition })
        .then(data => {
            res.send({
                status: true,
                message: "The request has succeeded",
                data: {
                    users: data
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

// Find a single data with an id
exports.findOne = (req, res) => {
    const user_id = req.params.id;
    const conditions = {
        // Example condition: Find all instances where the 'someField' equals 'someValue'
        user_id: user_id
    };

    //address_users.findByPk(user_id)
    address_users.findAll({ where: conditions })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving data with id=" + id
            });
        });
};

// Create and Save a new Tutorial
exports.create = (req, res) => {
  try {
    //Validate request
    //const obj = objValidation(req.body);
    //res.send(obj);

    const payload = {
      uuid: uuid(),
      user_id: req.body.user_id,
      cep: req.body.cep,
      logradouro: req.body.logradouro,
      numero: req.body.numero,
      bairro: req.body.bairro,
      complemento: req.body?.complemento,
      cidade: req.body.cidade,
      estado: req.body.estado,
      pais: "BR",
      ativo: 0,
    };

    // Save Tutorial in the database
    address_users
      .create(payload)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating data.",
        });
        console.log(err);
      });

    // You can access specific elements of the parsed data like parsedData.elementName
  } catch (error) {
    console.log(error);
    console.error("Error:", error.message);
    res.status(500).send(error.message);
  }
};
exports.delete = (req, res) => {
  const id = req.params.id;
  try {
    const num = address_users.destroy({
      where: { id: id },
    });

    if (num == 1) {
      res.send({
        message: "Data was deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete Data with id=${id}. Maybe Data was not found!`,
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: "Could not delete Data with id=" + id,
    });
  }
};

// Update a Tutorial by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  await address_users.update(
    { ativo: 0 },
    { where: { user_id: req.body.user_id } }
  );

  await address_users
    .update({ ativo: 1 }, { where: { id: id } })
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
