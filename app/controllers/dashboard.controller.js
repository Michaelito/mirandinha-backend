const sequelize = require("../config/database");
const db = require("../models");
const Pedidos = db.pedidos;
const { fn, col, Op } = require("sequelize");

// Retrieve all GrupoFormats from the database.
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    // Consulta para somar quantidade e soma total por mês e ano
    const resultPedidos = await Pedidos.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("createdAt"), "%Y"), "year"],
        [fn("DATE_FORMAT", col("createdAt"), "%m"), "month"],
        [fn("COUNT", col("id")), "count_orders"],
        [fn("SUM", col("total_geral")), "sum_total_orders"],
      ],
      where: {
        user_id: id, // Condição específica (opcional)
      },
      group: [
        "user_id",
        fn("DATE_FORMAT", col("createdAt"), "%Y"),
        fn("DATE_FORMAT", col("createdAt"), "%m"),
      ], // Agrupa por ano e mês
      order: [[fn("DATE_FORMAT", col("createdAt"), "%Y-%m"), "ASC"]],
    });

    // Validate if there are any records in resultPedidos
    if (resultPedidos.length === 0) {
      // If no records were found, send a "No records" response
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    } else {
      // Enviando resposta com os dados de pedidos
      res.status(200).send({
        status: true,
        message: "The request has succeeded",
        data: {
          dashboard: resultPedidos,
        },
      });
    }
  } catch (error) {
    // Enviando resposta de erro
    res.status(500).send({
      status: false,
      message: "Ocorreu um erro ao buscar os dados dos pedidos",
      error: error.message, // Envia a mensagem de erro
    });
  }
};
