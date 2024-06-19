const db = require("../models");
const Pedidos = db.michaelpedidos;
const Op = db.Sequelize.Op;
const { uuid } = require("uuidv4");

// Create and Save a new Data
exports.create = (req, res) => {
  
  const pedidosArray = req.body.pedido_itens;

  // Use map() to iterate over itensArray and create promises for each item insertion
  const data = pedidosArray.forEach((pedido_item) => {
    // Create a promise for each item insertion
    let insertPedido = Pedidos.create({
      ...pedido_item, // Spread the properties of pedido
      uuid: uuid(),
      cliente: req.body.cliente.nome,
      celular: req.body.cliente.celular,
      valor_total: parseInt(pedido_item.qtde) * parseFloat(pedido_item.valor_unit),
    });

  
    // Push the promise into the array
    pedidosArray.push(insertPedido);
  });

  try {
    res.status(200).send({
      status: true,
      message: "The request has succeeded",
    });
  } catch (erro) {
    // Lidando com o erro
    res.status(500).send({
      status: false,
      message: "The request has not succeeded"
    });
  }
};
