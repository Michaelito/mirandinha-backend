const db = require("../models");
const pedidosItens = db.pedidos_itens;
const { uuid } = require('uuidv4');
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
    const payload = {
        id: req.body.id,
        id_produto: req.body.id_produto,
        id_pedido: req.body.id_pedido,
        produto: req.body.produto,
        preco: req.body.preco,
        qtde: req.body.qtde,
        total: req.body.total,
        peso: req.body.peso
    };

    // Save PedidosItens in the database
    pedidosItens.create(payload)
        .then(data => {
            res.send(data);
        })

        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating data."
            });
        });
};
exports.findAll = (req, res) => {
  const id = req.params.id;

  pedidosItens
    .findAll({ where: { pedido_id: id } })
    .then((data) => {
      res.send({
        status: true,
        message: "The request has succeeded",
        data: {
          pedidos_itens: data,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: err.message || "Some error occurred while retrieving Data.",
      });
    });
};