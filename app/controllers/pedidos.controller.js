const db = require("../models");
const pedidos = db.pedidos;
const pedidosItens = db.pedidos_itens;
const { uuid } = require('uuidv4');
const Op = db.Sequelize.Op;
const sequelize = require("../config/database");
const { decodeTokenFromHeader } = require('../middleware/auth.js');
const axios = require('axios');


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
exports.create = async (req, res) => {

  const decodedToken = decodeTokenFromHeader(req);

  try {
    // Create the payload with additional attributes
    const payload = {
      ...req.body, // Spread the properties of req.body
      id_user: decodedToken.id,
      id_empresa: decodedToken.id_empresa,
    };

    // Save the order in the database
    const data = await pedidos.create(payload);
    const id_pedido = data.id;

    const itensArray = req.body.pedido_itens;

    // Create promises for each item insertion
    const insertionPromises = itensArray.map(pedido_item => {
      return pedidosItens.create({
        ...pedido_item, // Spread the properties of pedido_item
        id_pedido: id_pedido, // Assign the pedido_id to the item
      });
    });

    // Await all promises to ensure all items are inserted
    await Promise.all(insertionPromises);

    // Insert exsam logic here
    // ...

    const clientes = await sequelize.query(
      `SELECT * FROM clientes WHERE id = ${decodedToken.id_empresa}`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const exsam = clientes[0];

    const ordersItens = await sequelize.query(
      `SELECT id_exsam, qtde, preco FROM pedidos_itens p WHERE p.id_pedido = ${id_pedido}`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const ordersArray = ordersItens.map(item => ({
      id_produto: item.id_exsam,
      qtde: parseInt(item.qtde, 10),  // Convert qtde to integer
      preco: parseInt(item.preco, 10), // Convert preco to integer
      age_doc: "",
      age_pro: ""
    }));

    const orderHeader = {
      "id_agente": exsam['id_exsam'],
      "lj_agente": "01",
      "id_tipcli": "R",
      "id_pagto": exsam['id_pagamento'],
      "id_fpagto": 0,
      "id_tabpre": exsam['id_tabpre'],
      "id_vended1": exsam['id_vendedor'],
      "comissao1": 3,
      "id_frete": 0,
      "id_transp": exsam['id_trasnportador'],
      "lj_transp": "01",
      "itens": ordersArray
    }

    const dataOrderExsam = JSON.stringify(orderHeader, null, 2)

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://exsammirandinha.ddns.com.br:7780/api/pedidos',
      headers: {
        'Authorization': 'Key ZZ3qxtMGPQFXBFm8qtZbACiumpzhsjJ7',
        'Content-Type': 'application/json'
      },
      data: dataOrderExsam
    };

    const response = await axios.request(config);

    console.log("-------exsam--------", response.data);

    const exsamId = response.data.success.id;

    await sequelize.query(
      `UPDATE pedidos SET pedido_id_exsam = :exsamId, status = 11 WHERE id = :id_pedido`,
      {
        replacements: { exsamId, id_pedido },
        type: sequelize.QueryTypes.UPDATE
      }
    );

    res.send(data);

  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating data.",
    });
  }
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
