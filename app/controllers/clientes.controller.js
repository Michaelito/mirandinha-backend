const db = require("../models");
const clienteService = require("../services/cliente.service");
const Clientes = db.clientes;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // // Create a Ciente
  // const cliente = {
  //   lj: req.body.lj,
  //   nome: req.body.nome,
  //   guerra: req.body.guerra,
  //   id_pessoa: req.body.id_pessoa,
  //   id_tipo: req.body.id_tipo,
  //   id_vended1: req.body.id_vended1,
  //   id_vended2: req.body.id_vended2,
  //   id_vended3: req.body.id_vended3,
  //   id_tabpre: req.body.id_tabpre,
  //   id_pagto: req.body.id_pagto,
  //   id_fpagto: req.body.id_fpagto,
  //   id_transp: req.body.id_transp,
  //   lj_transp: req.body.lj_transp,
  //   id_frete: req.body.id_frete,
  //   cnpj: req.body.cnpj,
  //   ie: req.body.ie,
  //   email: req.body.email,
  //   ddd1: req.body.ddd1,
  //   fone1: req.body.fone1,
  //   ddd2: req.body.ddd2,
  //   fone2: req.body.fone2,
  //   cep: req.body.cep,
  //   endereco: req.body.endereco,
  //   endnum: req.body.endnum,
  //   endcpl: req.body.endcpl,
  //   bairro: req.body.bairro,
  //   id_cidade: req.body.id_cidade,
  //   cidade: req.body.cidade,
  //   uf: req.body.uf,
  //   id_pais: req.body.id_pais
  // };
  // // Save Tutorial in the database
  // Clientes.create(cliente)
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message: err.message || "Some error occurred while creating the Cliente."
  //     });
  //   });
  // const data =
  //   <clientes>
  //     <nsu>DataTypes.STRING</nsu>
  //     <id type="DataTypes.INTEGER" allowNull="false" primaryKey="true" autoIncrement="true" />
  //     <lj>DataTypes.STRING</lj>
  //     <nome>DataTypes.STRING</nome>
  //     <guerra>DataTypes.STRING</guerra>
  //     <id_pessoa>DataTypes.STRING</id_pessoa>
  //     <id_tipo>DataTypes.STRING</id_tipo>
  //     <id_vended1>DataTypes.STRING</id_vended1>
  //     <id_vended2>DataTypes.STRING</id_vended2>
  //     <id_vended3>DataTypes.STRING</id_vended3>
  //     <id_tabpre>DataTypes.STRING</id_tabpre>
  //     <id_pagto>DataTypes.STRING</id_pagto>
  //     <id_fpagto>DataTypes.STRING</id_fpagto>
  //     <id_transp>DataTypes.STRING</id_transp>
  //     <lj_transp>DataTypes.STRING</lj_transp>
  //     <id_frete>DataTypes.STRING</id_frete>
  //     <cnpj>DataTypes.STRING</cnpj>
  //     <ie>DataTypes.STRING</ie>
  //     <email>DataTypes.STRING</email>
  //     <ddd1>DataTypes.STRING</ddd1>
  //     <fone1>DataTypes.STRING</fone1>
  //     <ddd2>DataTypes.STRING</ddd2>
  //     <fone2>DataTypes.STRING</fone2>
  //     <cep>DataTypes.STRING</cep>
  //     <endereco>DataTypes.STRING</endereco>
  //     <endnum>DataTypes.STRING</endnum>
  //     <endcpl>DataTypes.STRING</endcpl>
  //     <bairro>DataTypes.STRING</bairro>
  //     <id_cidade>DataTypes.STRING</id_cidade>
  //     <cidade>DataTypes.STRING</cidade>
  //     <uf>DataTypes.STRING</uf>
  //     <id_pais>DataTypes.STRING</id_pais>
  //   </clientes>
  // clienteService.createClienteExsam(data);
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
