const db = require("../models");
const Pedidos = db.michaelpedidos;
const PedidosModel = db.michaelpedidos;
const PedidoItens = db.michaelpedido_itens;
const PedidosItensModel = db.michaelpedido_itens;
const CustomersModel = db.michaelcustomers;
const CustomersAddressModel = db.michael_customers_address;

const Op = db.Sequelize.Op;
const { uuid } = require("uuidv4");

exports.findAll = async (req, res) => {
  try {
    // Fetch all pedidos
    const pedidos = await PedidosModel.findAll();

    // Map through each pedido to fetch related items and customer details
    const payload = await Promise.all(pedidos.map(async (pedido) => {
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

      // Structure the payload for each pedido
      return {
        ...pedido.dataValues,
        pedido_itens: pedidoItens,
        customer: {
          name: customer ? customer.name : null, // Check if customer exists
          phone: customerAddress ? customerAddress.phone : null, // Check if address exists
        },
        address: customerAddress || null, // Return null if address does not exist
      };
    }));

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


// Find a single Data with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  const pedido = await PedidosModel.findOne({
    where: { id: id },
  });
  console.log(pedido);

  const pedidoItens = await PedidosItensModel.findOne({
    where: { pedido_id: id },
    attributes: {
      exclude: ["id", "pedido_id", "status", "createdAt", "updatedAt"], // Adicione os nomes das colunas que você deseja ocultar
    },
  });

  console.log("pedidosItens" + pedidoItens);

  const customer = await CustomersModel.findOne({
    where: { id: pedido.id_cliente },
  });

  console.log("customer" + customer);

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
      ], // Adicione os nomes das colunas que você deseja ocultar
    },
  });

  // Modify the data as needed
  const payload = {
    ...pedido.dataValues,
    pedido_itens: pedidoItens,
    customer: {
      name: customer.name,
      phone: customerAddress.phone,
    },
    address: customerAddress,
  };

  try {
    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        pedido: payload,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error updating Data with id=" + id,
    });
  }
};

// Create and Save a new Data
exports.create = (req, res) => {
  const pedidobody = req.body;

  const currentDate = new Date(); // Get the current date and time

  // Adjust for timezone offset (-3 hours)
  const timezoneOffset = -3 * 60; // Convert hours to minutes
  const adjustedDate = new Date(
    currentDate.getTime() + timezoneOffset * 60 * 1000
  );

  const etapa = req.body.id_cliente_endereco == null ? 0 : 1;

  const payloadPedido = {
    uuid: uuid(),
    data_pedido: adjustedDate,
    etapa: etapa,
    ...pedidobody,
  };

  Pedidos.create(payloadPedido)
    .then((data) => {
      const pedido_id = data.id;

      const pedidosArray = req.body.pedido_itens;

      pedidosArray.forEach((pedido_item) => {
        const valorTotal =
          parseInt(pedido_item.qtde) * parseFloat(pedido_item.valor_unitario);

        // Create a promise for each item insertion
        let insertPedidoItens = PedidoItens.create({
          ...pedido_item, // Spread the properties of pedido
          uuid: uuid(),
          pedido_id: pedido_id,
          valor_total: valorTotal,
          valor_desconto: isNaN(parseFloat(pedido_item.valor_desconto))
            ? 0
            : parseFloat(pedido_item.valor_desconto),
        });

        // Push the promise into the array
        pedidosArray.push(insertPedidoItens);
      });

      res.send({
        status: true,
        message: "The request has succeeded",
        data: {
          pedido: data,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating data.",
      });
    });
};

exports.statusOrder = (req, res) => {
  const id = req.params.id;

  Pedidos.update(req.body, {
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
