const db = require("../models");
const Pedidos = db.michaelpedidos;
const PedidoItens = db.michaelpedido_itens;

const Op = db.Sequelize.Op;
const { uuid } = require("uuidv4");

// Retrieve all Datas from the database.
exports.findAll = (req, res) => {
  const id_cliente = req.query.id_cliente;
  var condition = id_cliente
    ? {
        id_cliente: {
          [Op.like]: `%${id_cliente}%`,
        },
      }
    : null;

  Pedidos.hasMany(PedidoItens, {
    foreignKey: "pedido_id",
  });
  
  Pedidos.hasMany(PedidoItens, {
    foreignKey: "pedido_id",
  });

  Pedidos.findAll({
    where: condition,
    include: [
      {
        model: PedidoItens,
        required: false,
        attributes: [
          "produto",
          "qtde",
          "valor_unitario",
          "valor_desconto",
          "valor_total",
          "obs",
        ],
      },
    ],
  })
    .then((data) => {
      res.status(200).send({
        status: true,
        message: "The request has succeeded",
        data: {
          pedidos: data,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "The request has not succeeded",
        data: null,
      });
    });
};

// Find a single Data with an id
exports.findOne = (req, res) => {
  const pedido_id = req.params.id;

  PedidoItens.findAll({ where: { pedido_id: pedido_id } })
    .then((data) => {
      res.status(200).send({
        status: true,
        message: "The request has succeeded",
        data: {
          pedido: data,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "Error retrieving Data with id=" + id,
      });
    });
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