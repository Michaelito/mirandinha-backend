const db = require("../models");
const pedidos = db.pedidos;
const pedidosItens = db.pedidos_itens;
const { uuid } = require('uuidv4');
const Op = db.Sequelize.Op;


// Retrieve all from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id
    ? {
        id: {
          [Op.like]: `%${id}%`,
        },
      }
    : null;

  pedidos
    .findAll({ where: condition })
    .then((data) => {
      res
        .send({
          status: true,
          message: "The request has succeeded",
          data: {
            pedidos: data,
          },
        })
        .status(200);
    })
    .catch((err) => {
      res
        .send({
          status: false,
          message: err + "The request has not succeeded",
          data: null,
        })
        .status(500);
    });
};

// Find a single Data with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  pedidos.hasMany(pedidosItens, {
    foreignKey: "pedido_id",
  });

  pedidos
    .findByPk(id, {
      //attributes: { exclude: ['password', 'token', 'refresh_token'] },
      include: [
        {
          model: pedidosItens,
          required: false,
          //attributes: ['fullname', 'document', 'type', 'rg_ie', 'birthdate', 'createdAt']
        },
      ],
    })
    .then((data) => {
      res
        .send({
          status: true,
          message: "The request has succeeded",
          data: {
            pedido: data,
          },
        })
        .status(200);
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "Error retrieving Data with id=" + id,
      });
    });
};

// Create and Save a new User
exports.create = (req, res) => {
  const payload = {
    cnpjf: req.body.cnpjf,
    user_id: req.body.user_id,
    nome: req.body.nome,
    cep: req.body.cep,
    endnum: req.body.endnum,
    endcpl: req.body.endcpl,
    bairro: req.body.bairro,
    id_cidade: req.body.id_cidade,
    cidade: req.body.cidade,
    uf: req.body.uf,
    email: req.body.email,
    ddd1: req.body.ddd1,
    fone1: req.body.fone1,
    dh_mov: req.body.dh_mov,
    id_fpagto: req.body.id_fpagto,
    id_pagto: req.body.id_pagto,
    id_vended1: req.body.id_vended1,
    id_transp: req.body.id_transp,
    id_frete: req.body.id_frete,
    prazo: req.body.prazo,
    peso_bru: req.body.peso_bru,
    peso_liq: req.body.peso_liq,
    total: req.body.total,
    frete: req.body.frete,
    desconto: req.body.desconto,
    total_geral: req.body.total_geral,
  };

  // Save Tutorial in the database
  pedidos
    .create(payload)
    .then((data) => {
      const pedido_id = data.id;

      console.log(pedido_id);

      const itensArray = req.body.pedido_itens;

      // Use map() to iterate over itensArray and create promises for each item insertion
      itensArray.forEach((pedido_item) => {
        // Create a promise for each item insertion
        let insertionPromise = pedidosItens.create({
          ...pedido_item, // Spread the properties of pedido_item
          pedido_id: pedido_id, // Assign the pedido_id to the item
        });

        // Push the promise into the array
        itensArray.push(insertionPromise);
      });

      // Use map to create an array of promises for each item insertion
      // const insertionPromises = itensArray.map(itemData  => create(itemData));

      // Execute all insertion promises concurrently using Promise.all

      // let insertionPromise = itensArray.create({
      //     ...insertionPromise,  // Spread the properties of pedido_item
      //     pedido_id: pedido_id  // Assign the pedido_id to the item
      // });

      // // Push the promise into the array
      // insertionPromises.push(insertionPromise);

      // pedido_itens.forEach(pedido_item => {
      //     const itens = pedidosItens.create(pedido_item);
      //     itens.push
      // });

      res.send(data);
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating data.",
      });
    });
};
