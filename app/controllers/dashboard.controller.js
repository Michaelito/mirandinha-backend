const sequelize = require("../config/database");
const db = require("../models");
const Pedidos = db.pedidos;
const Op = db.Sequelize.Op;

// Retrieve all GrupoFormats from the database.
exports.findAll = async (req, res) => {
  const id = req.params.id;

  const resultPedidos = await Pedidos.findAll({
    where: { id: id },
  });

  const results = await sequelize.query(
    "SELECT * FROM cores WHERE status = :status",
    {
      replacements: { status: 1 },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  res.status(200).send({
    status: true,
    message: "The request has succeeded",
    data: {
      Grupos: results,
    },
  });
};
