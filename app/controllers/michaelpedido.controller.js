const db = require("../models");
const Pedidos = db.michaelpedidos;
const PedidosModel = db.michaelpedidos;
const PedidoItens = db.michaelpedido_itens;
const PedidosItensModel = db.michaelpedido_itens;
const CustomersModel = db.michaelcustomers;
const CustomersAddressModel = db.michael_customers_address;

const Op = db.Sequelize.Op;
const { uuid } = require("uuidv4");

// Retrieve all Datas from the database.
exports.findAll = async (req, res) => {
  try {
    // Busca todos os pedidos
    const pedidos = await PedidosModel.findAll();
    
    // Verifica se existem pedidos
    if (!pedidos || pedidos.length === 0) {
      return res.status(404).send({
        status: false,
        message: "No orders found.",
      });
    }

    // Mapeia cada pedido para adicionar os detalhes de itens e cliente
    const payload = await Promise.all(pedidos.map(async (pedido) => {
      const pedidoItens = await PedidosItensModel.findAll({
        where: { pedido_id: pedido.id },
        attributes: {
          exclude: ["id", "pedido_id", "status", "createdAt", "updatedAt"], // Ocultar colunas indesejadas
        },
      });

      const customer = await CustomersModel.findOne({
        where: { id: pedido.id_cliente },
      });

      // Inicializa o objeto customerAddress como null
      let customerAddress = null;

      // Se o cliente foi encontrado, busca o endereço
      if (customer) {
        customerAddress = await CustomersAddressModel.findOne({
          where: { customers_id: pedido.id_cliente },
          attributes: {
            exclude: [
              "id",
              "enterprise_id",
              "customers_id",
              "delivery_id",
              "createdAt",
              "updatedAt",
            ], // Ocultar colunas indesejadas
          },
        });
      }

      return {
        pedido,
        pedido_itens: pedidoItens,
        customer: customer ? { // Se o cliente foi encontrado, retorna suas informações
          name: customer.name,
          phone: customerAddress ? customerAddress.phone : null, // Verifica se o endereço existe antes de acessar 'phone'
        } : null, // Se não, retorna null
        address: customerAddress, // Retorna o endereço, que pode ser null
      };
    }));

    // Envia a resposta com os dados dos pedidos
    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: payload,
    });
    
  } catch (error) {
    // Envia erro caso ocorra
    console.error("Error retrieving data: ", error); // Log do erro
    res.status(500).send({
      status: false,
      message: "Error retrieving data: " + error.message,
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

  payload = {
    pedido,
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
      data: payload,
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
