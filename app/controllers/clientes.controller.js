const db = require("../models");
const clienteService = require("../services/cliente.service");
const Clientes = db.clientes;
const Op = db.Sequelize.Op;


exports.create = async (req, res) => {
  try {
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

    // Save Tutorial in the database
    const externalResponse = await clienteService.createClienteExsam(cliente);
    const localResponse = await
      Clientes.create(cliente)
    res.send({
      status: true,
      message: "The request has succeeded",
      data: {
        cliente: data,
        ApiData: externalResponse,
      },

    });
  }
  catch (err) {
    res.status(500).send({
      message: err.message,
    });


  };
}
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
