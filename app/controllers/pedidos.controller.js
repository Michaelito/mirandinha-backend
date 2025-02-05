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
      `SELECT p.id, p.createdAt, c.razao_social, u.fullname, p.total, p.status
       FROM pedidos p
       JOIN clientes c ON c.id = p.id_empresa 
       JOIN users u ON u.id = p.id_user 
       ORDER BY p.id DESC
       LIMIT ? OFFSET ?`,
      {
        replacements: [limit, offset],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (pedidos.length === 0) {
      return res.status(200).send({ message: "Produto não encontrado" });
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
      return res.status(200).send({ message: "Produto não encontrado" });
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

  const id = req.body.id;

  console.log("-------id--------", id);

  const pedido = await sequelize.query(
    `SELECT request_exsam FROM pedidos WHERE id = ${id}`,
    { type: sequelize.QueryTypes.SELECT }
  );

  const obj = JSON.stringify(pedido[0].request_exsam);
  const jsonObject = JSON.parse(obj)
  console.log("--------------obj-------------", jsonObject);

  return

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://exsammirandinha.ddns.com.br:7780/api/pedidos",
    headers: {
      Authorization: "Key ZZ3qxtMGPQFXBFm8qtZbACiumpzhsjJ7",
      "Content-Type": "application/json",
    },
    data: obj,
  };

  response = await axios.request(config);

  if (response.status === 200) {
    console.log("-------exsam--------", response.data);

    const exsamId = response.data.success.num;
    const request_exsam = dataOrderExsam;
    const response_exsam = response.data;

    await sequelize.query(
      `UPDATE pedidos SET pedido_id_exsam = :exsamId, request_exsam = :request_exsam, response_exsam = :response_exsam WHERE id = :id_pedido`,
      {
        replacements: {
          exsamId,
          request_exsam: request_exsam,
          response_exsam: JSON.stringify(response_exsam),
          id_pedido,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );
  }
  else {
    throw new Error(`Resposta inválida do servidor: ${response.status}`);
  }

}


// Create and Save a new User
exports.create = async (req, res) => {
  const decodedToken = decodeTokenFromHeader(req);

  try {
    // Criação do payload com atributos adicionais
    const payload = {
      ...req.body,
      id_user: decodedToken.id,
      id_empresa: decodedToken.id_empresa,
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
        message: "The request has succeeded",
        data: {
          pedido: data,
        },
      });

    }

    const clientes = await sequelize.query(
      `SELECT * FROM clientes WHERE id = ${decodedToken.id_empresa}`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const exsam = clientes[0];

    const ordersItens = await sequelize.query(
      `SELECT id_exsam, qtde, preco FROM pedidos_itens p WHERE p.id_pedido = ${id_pedido}`,
      { type: sequelize.QueryTypes.SELECT }
    );

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
      id_pagto: exsam["id_pagamento"],
      id_fpagto: exsam["id_forma_pagamento"],
      id_tabpre: exsam["id_tabpre"],
      id_vended1: exsam["id_vendedor"],
      comissao1: 3,
      id_frete: 0,
      id_transp: exsam["id_trasnportador"],
      lj_transp: "01",
      itens: ordersArray,
    };

    const dataOrderExsam = JSON.stringify(orderHeader, null, 2);


    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://exsammirandinha.ddns.com.br:7780/api/pedidos",
      headers: {
        Authorization: "Key ZZ3qxtMGPQFXBFm8qtZbACiumpzhsjJ7",
        "Content-Type": "application/json",
      },
      data: dataOrderExsam,
    };

    console.log("-------request exsam--------", dataOrderExsam);



    let exsamId = null;
    let response = null;
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        response = await axios.request(config);

        if (response.status === 200) {
          console.log("-------exsam--------", response.data);

          let exsamId = response.data.success.num;
          const request_exsam = dataOrderExsam;
          const response_exsam = response.data;

          await sequelize.query(
            `UPDATE pedidos SET pedido_id_exsam = :exsamId, request_exsam = :request_exsam, response_exsam = :response_exsam WHERE id = :id_pedido`,
            {
              replacements: {
                exsamId,
                request_exsam: request_exsam,
                response_exsam: JSON.stringify(response_exsam),
                id_pedido,
              },
              type: sequelize.QueryTypes.UPDATE,
            }
          );

          const idata = {
            ...(data.get ? data.get() : data),
            pedido_id_exsam: parseInt(exsamId),
          };

          res.send(idata);
          return; // Encerra o fluxo em caso de sucesso
        } else {
          throw new Error(`Resposta inválida do servidor: ${response.status}`);
        }
      } catch (err) {


        await sequelize.query(
          `UPDATE pedidos SET pedido_id_exsam = :exsamId, response_exsam = :response_exsam_error WHERE id = :id_pedido`,
          {
            replacements: {
              exsamId,
              response_exsam: JSON.stringify(err),
              id_pedido,
            },
            type: sequelize.QueryTypes.UPDATE,
          }
        );

        retries++;
        console.error(`Tentativa ${retries} falhou:`, err.message);

        if (retries === maxRetries) {

          console.error("Máximo de tentativas alcançado. Desistindo.");

          res.status(500).send({
            message:
              "Falha ao processar o pedido no Exsam após múltiplas tentativas.",
          });

          return; // Encerra o fluxo em caso de falha após retries
        }
      }
    }
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
  const { id } = req.params;
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
        replacements: isAdmin ? [id] : [id, id_user],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (orders.length === 0) {
      return res.status(200).send({ status: true, message: "DATA NOT FOUND" });
    }


    await sequelize.query(
      `UPDATE pedidos SET status = ?, status_convert = 1 WHERE id = ?${isAdmin ? '' : ' AND id_user = ?'}`,
      {
        replacements: isAdmin ? [status, id] : [status, id, id_user],
        type: sequelize.QueryTypes.UPDATE,
      }
    );


    createOrder(res, id);







  } catch (error) {
    res.status(500).send({
      status: false,
      message: "The request has not 2 succeeded",
      error: error.message, // Inclui a mensagem de erro para depuração
    });
  }
};


const createOrder = async (res, id_pedido) => {
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

    console.log("id pedido", id_pedido);

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
      id_pagto: exsam["id_pagamento"],
      id_fpagto: exsam["id_forma_pagamento"],
      id_tabpre: exsam["id_tabpre"],
      id_vended1: exsam["id_vendedor"],
      comissao1: 3,
      id_frete: 0,
      id_transp: exsam["id_trasnportador"],
      lj_transp: "01",
      itens: ordersArray,
    };

    const dataOrderExsam = JSON.stringify(orderHeader, null, 2);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://exsammirandinha.ddns.com.br:7780/api/pedidos",
      headers: {
        Authorization: "Key ZZ3qxtMGPQFXBFm8qtZbACiumpzhsjJ7",
        "Content-Type": "application/json",
      },
      data: dataOrderExsam,
    };

    console.log("-------request exsam--------", dataOrderExsam);

    let exsamId = null;
    let response = null;
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        response = await axios.request(config);

        if (response.status === 200) {
          console.log("-------exsam--------", response.data);

          exsamId = response.data.success.num;
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

          const idata = {
            ...(data.get ? data.get() : data),
            pedido_id_exsam: parseInt(exsamId),
          };

          res.send(idata);
          return; // End flow on success
        } else {
          throw new Error(`Invalid server response: ${response.status}`);
        }
      } catch (err) {
        await sequelize.query(
          `UPDATE pedidos SET pedido_id_exsam = :exsamId, response_exsam = :response_exasam_error WHERE id = :id_pedido`,
          {
            replacements: {
              exsamId,
              response_exasam: JSON.stringify(err),
              id_pedido,
            },
            type: sequelize.QueryTypes.UPDATE,
          }
        );

        retries++;
        console.error(`Attempt ${retries} failed:`, err.message);

        if (retries === maxRetries) {
          console.error("Maximum attempts reached. Giving up.");

          // Send error response only once
          if (!res.headersSent) {
            res.status(500).send({
              message:
                "Failed to process the order in Exsam after multiple attempts.",
            });
          }

          return; // End flow on failure after retries
        }
      }
    }
  } catch (err) {
    // Send error response only once
    if (!res.headersSent) {
      res.status(500).send({
        message: err.message || "An error occurred while creating the order.",
      });
    }
  }
};

// Usage example:
// createOrder(somePedidoId);
