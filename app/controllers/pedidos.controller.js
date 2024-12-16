const db = require("../models");
const pedidos = db.pedidos;
const pedidosItens = db.pedidos_itens;
const { uuid } = require('uuidv4');
const Op = db.Sequelize.Op;
const sequelize = require("../config/database");


// Retrieve all from the database.
exports.findAll = async (req, res) => {
  const id = req.query.id;
  var condition = id
    ? {
      id: {
        [Op.like]: `%${id}%`,
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
  const pedidosWithCount = await pedidos.findAndCountAll({
    where: condition,
    limit: size,
    offset: page * size,
    order: [
      ["id", "DESC"], // Order by age descending
    ],
  });
  res.send({
    status: true,
    message: "The request has succeeded",
    limit: size,
    page: page,
    totalPages: Math.ceil(pedidosWithCount.count / Number.parseInt(size)),
    data: {
      pedidos: pedidosWithCount.rows,
    },
  });
};

// Find a single Data with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    // Consulta para buscar o pedido específico
    const orders = await sequelize.query(
      `SELECT * FROM pedidos p WHERE p.id = ?`,
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Verifica se o pedido foi encontrado
    if (orders.length === 0) {
      return res.status(404).send({
        status: false,
        message: "Order not found",
      });
    }

    const order = orders[0]; // Obtém o primeiro (e único) pedido

    // Consultar os itens do pedido
    const pedidoItens = await sequelize.query(
      "SELECT * FROM pedidos_itens WHERE id_pedido = ? ORDER BY id ASC",
      {
        replacements: [order.id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Adiciona a propriedade 'produtos_grades' ao pedido
    order.pedido_itens = pedidoItens;

    // Retornar o pedido com os itens
    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        order: order, // Retorna o pedido único
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
    });
  }
};


// Create and Save a new User
exports.create = (req, res) => {
  const payload = {
    cnpjf: req.body.cnpjf,
    user_id: req.body.user_id,
    nome: req.body.nome,
    cep: req.body.cep,
    endereco: req.body.endereco,
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
      const id_pedido = data.id;

      const itensArray = req.body.pedido_itens;

      // Use map() to iterate over itensArray and create promises for each item insertion
      itensArray.forEach((pedido_item) => {
        // Create a promise for each item insertion
        let insertionPromise = pedidosItens.create({
          ...pedido_item, // Spread the properties of pedido_item
          id_pedido: id_pedido, // Assign the pedido_id to the item
        });

        // Push the promise into the array
        itensArray.push(insertionPromise);
      });

      res.send(data);
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating data.",
      });
    });
};

exports.findAllUser = async (req, res) => {
  const id = req.params.id;

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

  const pedidosWithCount = await pedidos.findAndCountAll({
    where: { user_id: id },
    order: [
      ["id", "DESC"],
    ],
    limit: size,
    offset: page * size,
    order: [
      ["id", "DESC"], // Order by age descending
    ],
  });
  res.send({
    status: true,
    message: "The request has succeeded",
    limit: size,
    page: page,
    totalPages: Math.ceil(pedidosWithCount.count / Number.parseInt(size)),
    data: {
      pedidos: pedidosWithCount.rows,
    },
  });


  // pedidos
  //   .findAll({
  //     where: { user_id: id },
  //     order: [
  //       ["id", "DESC"], // Order by age descending
  //     ],
  //   })
  //   .then((data) => {
  //     res.send({
  //       status: true,
  //       message: "The request has succeeded",
  //       data: {
  //         pedidos: data,
  //       },
  //     });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       status: false,
  //       message: err.message || "Some error occurred while retrieving Data.",
  //     });
  //   });
};