const db = require("../models");
const Pedidos = db.michaelpedidos;
const PedidoItens = db.michaelpedido_itens;
const Op = db.Sequelize.Op;
const { uuid } = require("uuidv4");

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const cliente = req.query.cliente;
  var condition = cliente
    ? {
        cliente: {
          [Op.like]: `%${cliente}%`,
        },
      }
    : null;

  // Pedidos.hasMany(PedidoItens, {
  //   foreignKey: "pedido_id",
  // });

  Pedidos.findAll({
    where: condition,
    // include: [
    //   {
    //     model: PedidoItens,
    //     required: false,
    //     attributes: [
    //       "produto",
    //       "qtde",
    //       "valor_unitario",
    //       "valor_desconto",
    //       "valor_total",
    //       "obs",
    //     ],
    //   },
    // ],
  })
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
        message: "The request has not succeeded",
        data: null,
      });
    });
};

// Create and Save a new Data
exports.create = (req, res) => {
  const clientebody = req.body.cliente;

  const pedidobody = req.body.pedido;

  const payloadPedido = {
    uuid: uuid(),
    cliente: clientebody.nome,
    celular: clientebody.celular,
    valor_desconto: pedidobody.valor_desconto,
    valor_total: pedidobody.valor_total,
    obs: pedidobody.obs,
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

// // Retrieve all Tutorials from the database.
// exports.findAll = (req, res) => {
//   console.log("findAll");

//   const cliente = req.query.cliente;
//   var condition = cliente
//     ? {
//         cliente: {
//           [Op.like]: `%${cliente}%`,
//         },
//       }
//     : null;

//   // Pedidos.hasMany(PedidoItens, {
//   //   foreignKey: "pedido_id",
//   // });

//   Pedidos.findAll({
//     // include: [
//     //   {
//     //     model: PedidoItens,
//     //     required: false,
//     //     attributes: [
//     //       "produto",
//     //       "qtde",
//     //       "valor_unitario",
//     //       "valro_desconto",
//     //       "valor_total",
//     //       "obs",
//     //     ],
//     //   },
//     // ],
//     where: { condition }
//   })
//     .then((data) => {
//       res
//         .send({
//           status: true,
//           message: "The request has succeeded",
//           data: {
//             pedido: data,
//           },
//         })
//         .status(200);
//     })
//     .catch((err) => {
//       res
//         .send({
//           status: false,
//           message: "The request has not succeeded",
//           data: null,
//         })
//         .status(500);
//     });
// };
