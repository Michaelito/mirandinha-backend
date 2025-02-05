const db = require("../models");
const DeliveryArea = db.deliveryArea;
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require("uuid");

// Retrieve all Datas from the database.
exports.findAll = (req, res) => {
  const logradouro = req.query.logradouro;

  var condition = {};

  if (logradouro) {
    condition = {
      [Op.or]: [
        { logradouro: { [Op.like]: `%${logradouro}%` } },
        //{ id_exsam: { [Op.like]: `%${logradouro}%` } },
      ],
    };
  }

  DeliveryArea.findAll({ where: condition })
    .then((data) => {
      res.send({
        status: true,
        message: "The request has succeeded",
        data: {
          motoboys: data,
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

// Find a single Data with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  DeliveryArea.findByPk(id)
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
          motoboy: data,
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

// Create and Save a new Data
exports.create = (req, res) => {
  // Create a Data
  const payload = {
    id_empresa: req.body.id_empresa,
    cep: req.body.cep,
    numero_inicio: req.body.numero_inicio,
    numero_fim: req.body.numero_fim,
    tipo_logradouro: req.body.tipo_logradouro,
    logradouro: req.body.logradouro,
    bairro: req.body.bairro,
    cidade: req.body.cidade,
    uf: req.body.uf,
    id_frete_delivery: req.body.id_frete_delivery,
    adicional_frete: req.body.adicional_frete,
  };

  // Save Data in the database
  DeliveryArea.create(payload)
    .then((data) => {
      res.send({
        status: true,
        message: "The request has succeeded",
        data: {
          devliery_area: data,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "The request has not succeeded" + err,
        data: null,
      });
    });
};


// Update a Data by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  DeliveryArea.update(req.body, {
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

