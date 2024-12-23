const db = require("../models");
const pedidos = db.pedidos;
const pedidosItens = db.pedidos_itens;
const { uuid } = require('uuidv4');
const Op = db.Sequelize.Op;
const sequelize = require("../config/database");
const { decodeTokenFromHeader } = require('../middleware/auth.js');


exports.findAllErp = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  try {
    // Query to get the total count of products for pagination
    const totalProductsResult = await sequelize.query(
      `SELECT COUNT(*) as total FROM pedidos p`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const totalProducts = totalProductsResult[0]?.total || 0;

    // Query to fetch the paginated products
    const pedidos = await sequelize.query(
      `SELECT p.id, p.createdAt, c.razao_social, du.fullname, p.total, p.status
       FROM pedidos p
       JOIN clientes c ON c.id = p.id_empresa 
       JOIN users u ON u.id = p.id_user 
       JOIN data_users du ON du.user_id = u.id
       ORDER BY p.id DESC
       LIMIT ? OFFSET ?`,
      {
        replacements: [limit, offset],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (pedidos.length === 0) {
      return res.status(404).send({ message: "Produto não encontrado" });
    }

    // Return data with pagination
    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        pedidos: pedidos,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: totalProducts,
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
      error: error.message, // Included error message for debugging
    });
  }
};

// Retrieve all from the database.
exports.findAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const decodedToken = decodeTokenFromHeader(req);
  const id_empresa = decodedToken.id_empresa;

  try {
    // Query to get the total count of products for pagination
    const totalProductsResult = await sequelize.query(
      `SELECT COUNT(*) as total FROM pedidos p WHERE p.id_empresa = ?`,
      {
        replacements: [id_empresa],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const totalProducts = totalProductsResult[0]?.total || 0;

    // Query to fetch the paginated products
    const pedidos = await sequelize.query(
      `SELECT * FROM pedidos p
       WHERE p.id_empresa = ?
       ORDER BY p.id DESC
       LIMIT ? OFFSET ?`,
      {
        replacements: [id_empresa, limit, offset],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (pedidos.length === 0) {
      return res.status(404).send({ message: "Produto não encontrado" });
    }

    // Return data with pagination
    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        pedidos: pedidos,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: totalProducts,
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
      error: error.message, // Included error message for debugging
    });
  }
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

  const decodedToken = decodeTokenFromHeader(req);

  const payload = {
    cnpjf: req.body.cnpjf,
    id_user: decodedToken.id,
    id_empresa: decodedToken.id_empresa,
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const decodedToken = decodeTokenFromHeader(req);
  const id_user = decodedToken.id;

  try {
    // Query to get the total count of products for pagination
    const totalProductsResult = await sequelize.query(
      `SELECT COUNT(*) as total FROM pedidos p WHERE p.id_user = ?`,
      {
        replacements: [id_user],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const totalProducts = totalProductsResult[0]?.total || 0;

    // Query to fetch the paginated products
    const pedidos = await sequelize.query(
      `SELECT * FROM pedidos p
       WHERE p.id_user = ?
       ORDER BY p.id DESC
       LIMIT ? OFFSET ?`,
      {
        replacements: [id_user, limit, offset],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (pedidos.length === 0) {
      return res.status(404).send({ message: "Produto não encontrado" });
    }

    // Return data with pagination
    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        pedidos: pedidos,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: totalProducts,
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
      error: error.message, // Included error message for debugging
    });
  }
};
