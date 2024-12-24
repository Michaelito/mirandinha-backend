const db = require("../models");
const Clientes = db.clientes;
const Users = db.users;
const Op = db.Sequelize.Op;
const jsonxml = require('jsonxml');
const clienteSchema = require('../validation/clienteValidator');
const crypto = require("crypto");
const { uuid } = require("uuidv4");

exports.create = async (req, res) => {

  const { error, value } = clienteSchema.validate(req.body);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  try {

    const cnpjExists = await Clientes.findOne({ where: { cnpj: value.cnpj } });

    const emailExists = await Users.findOne({ where: { login: value.email } });

    if (emailExists) {
      return res.status(400).send({ error: 'E-MAIL already exists' });
    }

    if (cnpjExists) {
      return res.status(400).send({ error: 'CNPJ already exists' });
    }

    const novoCliente = await Clientes.create(req.body);
    const md5Hash = crypto.createHash("md5");
    md5Hash.update(value.password);
    const password_md5 = md5Hash.digest("hex");

    const cnpjLimpo = value.cnpj.replace(/\D/g, "");

    const payload = {
      uuid: uuid(),
      login: value.email,
      empresa_id: novoCliente.id,
      password: password_md5,
      profile: cnpjLimpo.length > 11 ? 2 : 1
    };

    await Users.create(payload);

    res.send({
      status: true,
      message: "The request has succeeded",
      data: {
        clientes: novoCliente,
      },
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }

};

exports.findAll = async (req, res) => {
  const nome = req.query.nome;
  var condition = nome
    ? {
      nome: {
        [Op.like]: `%${nome}%`,
      },
    }
    : null;
  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  let page = 0;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
    page = pageAsNumber;
  }

  let size = 20;
  if (
    !Number.isNaN(sizeAsNumber) &&
    !(sizeAsNumber > 50) &&
    !(sizeAsNumber < 1)
  ) {
    size = sizeAsNumber;
  }
  const clientWithCount = await Clientes.findAndCountAll({
    where: condition,
    limit: size,
    offset: page * size,
  });
  res.send({
    status: true,
    message: "The request has succeeded",
    limit: size,
    page: page,
    totalPages: Math.ceil(clientWithCount.count / Number.parseInt(size)),
    data: {
      clientes: clientWithCount.rows,
    },
  });
};

// Find a single Data with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Clientes.findByPk(id)
    .then((data) => {
      res.send({
        status: true,
        message: "The request has succeeded",
        data: {
          cliente: data,
        },
      });
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

  Clientes.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Data was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Data with id=${id}. Maybe Data was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Data with id=" + id
      });
    });
};