const db = require("../models");
const PedidosModel = db.michaelpedidos;
const PedidosItensModel = db.michaelpedido_itens;
const PedidosPagamentoModel = db.michaelpedido_pagamento;
const CustomersModel = db.michaelcustomers;
const CustomersAddressModel = db.michael_customers_address;
const MotoboyModel = db.motoboy;

const Op = db.Sequelize.Op;
const { uuid } = require("uuidv4");

exports.findAll = async (req, res) => {
  try {
    // Fetch all pedidos
    const pedidos = await PedidosModel.findAll();

    // Map through each pedido to fetch related items and customer details
    const payload = await Promise.all(
      pedidos.map(async (pedido) => {
        // Fetch associated items for each pedido
        const pedidoItens = await PedidosItensModel.findAll({
          where: { pedido_id: pedido.id },
          attributes: {
            exclude: ["id", "pedido_id", "status", "createdAt", "updatedAt"],
          },
        });

        // Fetch customer details
        const customer = await CustomersModel.findOne({
          where: { id: pedido.id_cliente },
        });

        // Fetch customer address details
        const customerAddress = await CustomersAddressModel.findOne({
          where: { customers_id: pedido.id_cliente },
          attributes: {
            exclude: [
              "id",
              "enterprise_id",
              "customers_id",
              "delivery_id",
              "createdAt",
              "updatedAt",
            ],
          },
        });

        if (!customer) {
          var nomeBalcao = pedido.nome ? pedido.nome : "Não informado";
          var celularBalcao = pedido.celular ? pedido.celular : "Não informado";
        }

        // Define as descrições baseadas no ID
        const statusDescriptions = {
          0: "aberto",
          1: "pago",
          2: "produção",
          3: "embalado",
          4: "entrega",
          5: "finalizado",
          6: "cancelado",
        };

        // Função que retorna a descrição baseada no ID
        function getStatusDescription(id) {
          return statusDescriptions[id] || "ID inválido";
        }

        if (pedido.driver != 0) {
          var driverName = await MotoboyModel.findOne({
            where: { id: pedido.driver },
          });
        }


        // Structure the payload for each pedido
        return {
          ...pedido.dataValues,
          pedido_itens: pedidoItens,
          customer: {
            name: customer ? customer.name : nomeBalcao, // Fallback if customer is null
            phone: customerAddress ? customerAddress.phone : celularBalcao, // Fallback if address is null
          },
          etapa_label: getStatusDescription(pedido.etapa),
          driver_name: pedido.driver != 0 ? driverName.name : null,
          address: customerAddress || null, // Return null if address does not exist
        };
      })
    );

    // Respond with the aggregated data
    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        pedidos: payload,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error fetching data",
      error: error.message,
    });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    // Fetch the pedido by ID
    const pedido = await PedidosModel.findOne({
      where: { id: id },
    });

    if (!pedido) {
      return res.status(404).send({
        status: false,
        message: "Pedido not found",
      });
    }

    console.log(pedido);

    // Fetch associated pedido items
    const pedidoItens = await PedidosItensModel.findAll({
      // Changed to findAll to get all items
      where: { pedido_id: id },
      attributes: {
        exclude: ["id", "pedido_id", "status", "createdAt", "updatedAt"],
      },
    });

    // Fetch associated pedido items
    const pedidoPagamentos = await PedidosPagamentoModel.findAll({
      // Changed to findAll to get all items
      where: { pedido_id: id },
      attributes: {
        exclude: ["id", "pedido_id", "obs", "status"],
      },
    });

    const updatedPagamentos = pedidoPagamentos.map(pagamento => {
      const pagamentoObj = pagamento.toJSON(); // Converte a instância do Sequelize em um objeto simples

      if (pagamentoObj.pagamento_id === 1) {
        pagamentoObj.descricao = "dinheiro"; // Altera o campo baseado na condição
      }

      if (pagamentoObj.pagamento_id === 2) {
        pagamentoObj.descricao = "credito"; // Altera o campo baseado na condição
      }

      if (pagamentoObj.pagamento_id === 3) {
        pagamentoObj.descricao = "debito"; // Altera o campo baseado na condição
      }

      return pagamentoObj; // Retorna o objeto atualizado
    });

    console.log("pedidoItens", pedidoItens);

    // Fetch customer details
    const customer = await CustomersModel.findOne({
      where: { id: pedido.id_cliente },
    });

    if (pedido.driver != 0) {
      var driverName = await MotoboyModel.findOne({
        where: { id: pedido.driver },
      });
    }

    // Fetch customer address details
    const customerAddress = await CustomersAddressModel.findOne({
      where: { customers_id: pedido.id_cliente },
      attributes: {
        exclude: [
          "id",
          "enterprise_id",
          "customers_id",
          "delivery_id",
          "createdAt",
          "updatedAt",
        ],
      },
    });


    // Define as descrições baseadas no ID
    const statusDescriptions = {
      0: "aberto",
      1: "pago",
      2: "produção",
      3: "embalado",
      4: "entrega",
      5: "finalizado",
      6: "cancelado",
    };

    // Função que retorna a descrição baseada no ID
    function getStatusDescription(id) {
      return statusDescriptions[id] || "ID inválido";
    }

    // Prepare payload data with checks
    const payload = {
      ...pedido.dataValues,
      pedido_itens: pedidoItens,
      pedido_pagamentos: updatedPagamentos,
      customer: {
        name: pedido.tipo_entrega == 1 ? customer.name : pedido.nome, // Fallback if customer is null
        phone: pedido.tipo_entrega == 1 ? customerAddress.phone : pedido.celular, // Fallback if address is null
      },
      etapa_label: getStatusDescription(pedido.etapa),
      driver_name: pedido.driver != 0 ? driverName.name : null,
      address: customerAddress || null, // Return null if address does not exist
    };

    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        pedido: payload,
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({
      status: false,
      message: "Error retrieving Data with id=" + id,
      error: error.message, // Optionally include the error message for debugging
    });
  }
};

exports.create = async (req, res) => {
  const pedidobody = req.body;

  // Check if pedido_itens exists and is an array
  if (!Array.isArray(pedidobody.pedido_itens)) {
    return res.status(400).send({
      status: false,
      message: "pedido_itens must be an array.",
    });
  }

  const currentDate = new Date(); // Get the current date and time

  // Adjust for timezone offset (-3 hours)
  const timezoneOffset = -3 * 60; // Convert hours to minutes
  const adjustedDate = new Date(
    currentDate.getTime() + timezoneOffset * 60 * 1000
  );

  const payloadPedido = {
    uuid: uuid(),
    data_pedido: adjustedDate,
    etapa: pedidobody.id_cliente_endereco == null ? 0 : 1,
    nome: pedidobody.tipo_entrega != 1 ? pedidobody.cliente.nome : "",
    celular: pedidobody.tipo_entrega != 1 ? pedidobody.cliente.celular : "",
    ...pedidobody,
  };

  try {
    const data = await PedidosModel.create(payloadPedido);
    const pedido_id = data.id;

    const pedidosArray = pedidobody.pedido_itens.map((pedido_item) => {
      const valorTotal =
        parseInt(pedido_item.qtde) * parseFloat(pedido_item.valor_unitario);

      return PedidosItensModel.create({
        ...pedido_item, // Spread the properties of pedido
        uuid: uuid(),
        pedido_id: pedido_id,
        valor_total: valorTotal,
        valor_desconto: isNaN(parseFloat(pedido_item.valor_desconto))
          ? 0
          : parseFloat(pedido_item.valor_desconto),
      });
    });

    // Map and create pedido_pagamento entries
    const pagamentosArray = pedidobody.pedido_pagamento.map(
      (pedido_pagamento) => {
        return PedidosPagamentoModel.create({
          ...pedido_pagamento, // Spread the properties of pedido_pgamento
          uuid: uuid(),
          pedido_id: pedido_id,
          pagamento_id: pedido_pagamento.pagamento_id,
          valor: parseFloat(pedido_pagamento.valor),
        });
      }
    );

    // Wait for all items and payments to be inserted
    await Promise.all([...pedidosArray, ...pagamentosArray]);

    res.send({
      status: true,
      message: "The request has succeeded",
      data: {
        pedido: data,
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating data.",
    });
  }
};

exports.statusOrder = (req, res) => {
  const id = req.params.id;

  PedidosModel.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          status: true,
          message: "Data was updated successfully.",
        });
      } else {
        res.status(200).send({
          status: true,
          message: `Cannot update Data with id=${id}. Maybe Data was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "Error updating Data with id=" + id,
      });
    });
};


exports.accept_order = async (req, res) => {
  const pedidobody = req.body;

  try {

    res.send({
      status: true,
      message: "The request has succeeded"
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating data.",
    });
  }
};