const db = require("../models");
const Pedidos = db.michaelpedidos;
const PedidoItens = db.michaelpedido_itens;
const Op = db.Sequelize.Op;
const { uuid } = require("uuidv4");

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
        
        const valorTotal = parseInt(pedido_item.qtde) * parseFloat(pedido_item.valor_unitario)
        
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
