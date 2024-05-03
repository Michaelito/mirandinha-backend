const db = require("../models");
const clienteService = require("../services/cliente.service");
const Clientes = db.clientes;
const Op = db.Sequelize.Op;
const jsonxml = require('jsonxml');

exports.create = (req, res) => {
  // Create a Ciente
  const cliente = {
    lj: req.body.lj,
    nome: req.body.nome,
    guerra: req.body.guerra,
    id_pessoa: req.body.id_pessoa,
    id_tipo: req.body.id_tipo,
    id_vended1: req.body.id_vended1,
    id_vended2: req.body.id_vended2,
    id_vended3: req.body.id_vended3,
    id_tabpre: req.body.id_tabpre,
    id_pagto: req.body.id_pagto,
    id_fpagto: req.body.id_fpagto,
    id_transp: req.body.id_transp,
    lj_transp: req.body.lj_transp,
    id_frete: req.body.id_frete,
    cnpj: req.body.cnpj,
    ie: req.body.ie,
    email: req.body.email,
    ddd1: req.body.ddd1,
    fone1: req.body.fone1,
    ddd2: req.body.ddd2,
    fone2: req.body.fone2,
    cep: req.body.cep,
    endereco: req.body.endereco,
    endnum: req.body.endnum,
    endcpl: req.body.endcpl,
    bairro: req.body.bairro,
    id_cidade: req.body.id_cidade,
    cidade: req.body.cidade,
    uf: req.body.uf,
    id_pais: req.body.id_pais
  };
  const xmlData =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    "<cliente>" +
    "<lj>" + cliente.lj + "</lj>" +
    "<nome>" + cliente.nome + "</nome>" +
    "<guerra>" + cliente.guerra + "</guerra>" +
    "<id_pessoa>" + cliente.id_pessoa + "</id_pessoa>" +
    "<id_tipo>" + cliente.id_tipo + "</id_tipo>" +
    "<id_vended1>" + cliente.id_vended1 + "</id_vended1>" +
    "<id_vended2>" + cliente.id_vended2 + "</id_vended2>" +
    "<id_vended3>" + cliente.id_vended3 + "</id_vended3>" +
    "<id_tabpre>" + cliente.id_tabpre + "</id_tabpre>" +
    "<id_pagto>" + cliente.id_pagto + "</id_pagto>" +
    "<id_fpagto>" + cliente.id_fpagto + "</id_fpagto>" +
    "<id_transp>" + cliente.id_transp + "</id_transp>" +
    "<lj_transp>" + cliente.lj_transp + "</lj_transp>" +
    "<id_frete>" + cliente.id_frete + "</id_frete>" +
    "<cnpj>" + cliente.cnpj + "</cnpj>" +
    "<ie>" + cliente.ie + "</ie>" +
    "<email>" + cliente.email + "</email>" +
    "<ddd1>" + cliente.ddd1 + "</ddd1>" +
    "<fone1>" + cliente.fone1 + "</fone1>" +
    "<ddd2>" + cliente.ddd2 + "</ddd2>" +
    "<fone2>" + cliente.fone2 + "</fone2>" +
    "<cep>" + cliente.cep + "</cep>" +
    "<endereco>" + cliente.endereco + "</endereco>" +
    "<endnum>" + cliente.endnum + "</endnum>" +
    "<endcpl>" + cliente.endcpl + "</endcpl>" +
    "<bairro>" + cliente.bairro + "</bairro>" +
    "<id_cidade>" + cliente.id_cidade + "</id_cidade>" +
    "<cidade>" + cliente.cidade + "</cidade>" +
    "<uf>" + cliente.uf + "</uf>" +
    "<id_pais>" + cliente.id_pais + "</id_pais>" +
    "</cliente>";

  // Save Tutorial in the database
  Clientes.create(cliente)
    .then(data => {
      //res.send(data);
      clienteService.createClienteExsam(req, res, xmlData);

    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Cliente."
      });
    });



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

// Find a single Tutorial with an id
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
