require("dotenv-safe").config();
const db = require("../models");
const pedidos = db.pedidos;
const pedidosItens = db.pedidos_itens;
const sequelize = require("../config/database");
const { decodeTokenFromHeader } = require('../middleware/auth.js');
const axios = require('axios');
const { format } = require('date-fns');

exports.findAllErp = async (req, res) => {
  const decodedToken = decodeTokenFromHeader(req);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  if (decodedToken.profile != 1) {
    res.status(401).send({
      status: false,
      message: "The request has not succeeded",
    });
  }

  const { start_date, end_date, id_empresa, id_vendedor } = req.query;

  try {
    // 1. Construct the WHERE clause dynamically
    let whereClause = 'WHERE DATE(p.createdAt) BETWEEN :start_date AND :end_date';
    const replacements = {
      start_date: start_date || format(new Date(), 'yyyy-MM-dd'),
      end_date: end_date || format(new Date(), 'yyyy-MM-dd'),
    };

    if (id_empresa) {
      whereClause += ' AND p.id_empresa = :id_empresa';
      replacements.id_empresa = id_empresa;
    }

    if (id_vendedor) {
      whereClause += ' AND p.id_user = :id_vendedor';
      replacements.id_vendedor = id_vendedor;
    }

    // 2. Query to get the total count of products with dynamic WHERE clause
    const totalProductsResult = await sequelize.query(
      `SELECT COUNT(*) as total FROM pedidos p ${whereClause}`,
      {
        replacements: replacements,
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const totalProducts = totalProductsResult[0]?.total || 0;

    // 3. Query to fetch the paginated products with dynamic WHERE clause
    const pedidos = await sequelize.query(
      `SELECT p.id, p.createdAt, c.razao_social, u.fullname, p.total, p.status, p.pedido_id_exsam
      FROM pedidos p
      JOIN clientes c ON c.id = p.id_empresa
      JOIN users u ON u.id = p.id_user
      ${whereClause}
      ORDER BY p.id DESC
      LIMIT :limit OFFSET :offset`,
      {
        replacements: {
          ...replacements, // Spread the existing replacements
          limit: limit,
          offset: offset,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (pedidos.length === 0) {
      return res.status(200).send({ message: "DATA NOT FOUND" });
    }

    // 4. Return data with pagination
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
    console.error("Error fetching ERP data:", error);
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
      error: error.message,
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
      return res.status(200).send({ message: "DATA NOT FOUND" });
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
      return res.status(200).send({
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

exports.reprocess = async (req, res) => {

  const id_pedido = req.body.id_pedido;

  try {
    createOrder(req, res, id_pedido);

  } catch (error) {
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
      error: error.message, // Inclui a mensagem de erro para depuração
    });
  }


};


// Create and Save a new User
exports.create = async (req, res) => {
  const decodedToken = decodeTokenFromHeader(req);

  try {
    // Criação do payload com atributos adicionais
    const payload = {
      ...req.body,
      id_user: decodedToken.id,
      id_empresa: req.body.profile == 2 ? decodedToken.id_empresa : req.body.id_empresa
    };

    // Salva o pedido no banco de dados
    const data = await pedidos.create(payload);
    const id_pedido = data.id;

    const itensArray = req.body.pedido_itens;

    // Promises para inserção de itens
    const insertionPromises = itensArray.map((pedido_item) => {
      return pedidosItens.create({
        ...pedido_item,
        id_pedido: id_pedido,
      });
    });

    await Promise.all(insertionPromises);

    if (req.body.status === 0) {

      return res.status(200).send({
        status: true,
        message: "The request has succeeded"
      });

    }

    createOrder(req, res, id_pedido);

  } catch (err) {
    res.status(500).send({
      message: err.message || "Ocorreu um erro ao criar o pedido.",
    });
  }
};


exports.findAllUser = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const decodedToken = decodeTokenFromHeader(req);
  const id_user = decodedToken.id;

  console.log("id_user", id_user)

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
      `SELECT p.*, c.razao_social FROM pedidos p
       JOIN clientes c ON c.id = p.id_empresa
       WHERE p.id_user = ?
       ORDER BY p.id DESC
       LIMIT ? OFFSET ?`,
      {
        replacements: [id_user, limit, offset],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (pedidos.length === 0) {
      return res.status(200).send({ message: "DATA NOT FOUND" });
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


exports.updateById = async (req, res) => {
  const { id_pedido } = req.params;
  const { status } = req.body;
  const decodedToken = decodeTokenFromHeader(req);
  const id_user = decodedToken.id;
  const profile = decodedToken.profile;

  // Se o profile não for 1 ou 4, não pode alterar o status
  if (![1, 4].includes(profile)) {
    return res.status(401).send({ status: true, message: "UNAUTHORIZED" });
  }

  try {
    const isAdmin = profile === 1;

    const orders = await sequelize.query(
      `SELECT * FROM pedidos WHERE id = ?${isAdmin ? '' : ' AND id_user = ?'}`,
      {
        replacements: isAdmin ? [id_pedido] : [id_pedido, id_user],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (orders.length === 0) {
      return res.status(200).send({ status: true, message: "DATA NOT FOUND" });
    }


    await sequelize.query(
      `UPDATE pedidos SET status = ?, status_convert = 1 WHERE id = ?${isAdmin ? '' : ' AND id_user = ?'}`,
      {
        replacements: isAdmin ? [status, id_pedido] : [status, id_pedido, id_user],
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    createOrder(req, res, id_pedido);

  } catch (error) {
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
      error: error.message, // Inclui a mensagem de erro para depuração
    });
  }
};


const createOrder = async (req, res, id_pedido) => {

  if (!id_pedido) {
    return res.status(400).send({
      status: false,
      message: "Parameter id is required",
    });
  }

  try {
    const ordersItens = await sequelize.query(
      `SELECT pi.id, pi.id_exsam, pi.qtde, pi.preco, p.id_empresa FROM pedidos_itens pi JOIN pedidos p ON p.id = pi.id_pedido WHERE pi.id_pedido = ${id_pedido}`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const id_empresa = ordersItens[0].id_empresa;

    const clientes = await sequelize.query(
      `SELECT * FROM clientes WHERE id = ${id_empresa}`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const exsam = clientes[0];

    console.log("id pedido: ", id_pedido);

    const ordersArray = ordersItens.map((item) => ({
      id_produto: item.id_exsam,
      qtde: parseInt(item.qtde, 10),
      preco: parseInt(item.preco, 10),
      age_doc: "",
      age_pro: "",
    }));

    const orderHeader = {
      id_agente: exsam["id_exsam"],
      lj_agente: "01",
      id_tipcli: "R",
      id_pagto: "105",
      id_fpagto: req.body.id_fpagto ? req.body.id_fpagto : exsam["id_forma_pagamento"],
      id_tabpre: exsam["id_tabpre"],
      id_vended1: exsam["id_vendedor"],
      comissao1: 3,
      id_frete: 0,
      id_transp: exsam["id_trasnportador"],
      lj_transp: "01",
      itens: ordersArray,
    };

    const dataOrderExsam = JSON.stringify(orderHeader, null, 2);

    console.log("-------request exsam--------", dataOrderExsam);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://exsammirandinha.ddns.com.br:7780/api/pedidos",
      headers: {
        Authorization: "Key ZZ3qxtMGPQFXBFm8qtZbACiumpzhsjJ7",
        "Content-Type": "application/json",
      },
      data: dataOrderExsam,
    };

    const response = await axios.request(config);

    console.log("-------response exsam--------", response.data);

    const exsamId = response.data.success.num;
    const request_exsam = dataOrderExsam;
    const response_exsam = response.data;

    await sequelize.query(
      `UPDATE pedidos SET pedido_id_exsam = :exsamId, request_exsam = :request_exsam, response_exsam = :response_exsam WHERE id = :id_pedido`,
      {
        replacements: {
          exsamId,
          request_exsam,
          response_exsam: JSON.stringify(response_exsam),
          id_pedido,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    return res.status(200).send({
      status: true,
      message: "The request has succeeded",
    });


  } catch (err) {
    console.error("Error in createOrder:", err.message);
    res.status(500).send({
      message: err.message || "An error occurred while creating the order.",
    });
  }
};



