const db = require("../models");
const Pedidos = db.michaelpedidos;
const Op = db.Sequelize.Op;
const { uuid } = require("uuidv4");

// Create and Save a new Data
exports.create = (req, res) => {
  const pedidosArray = req.body;

  // Use map() to iterate over itensArray and create promises for each item insertion
  const data = pedidosArray.forEach((pedido) => {
    // Create a promise for each item insertion
    let insertPedido = Pedidos.create({
      ...pedido, // Spread the properties of pedido
      uuid: uuid(),
      valor_total: parseInt(pedido.qtde) * parseFloat(pedido.valor_unit),
    });

    console.log(pedido.qte * pedido.valor_unit);
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
