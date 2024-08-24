const sequelize = require("../config/database");
const db = require("../models");
const Pedidos = db.pedidos;
const { fn, col, Op } = require("sequelize");

// Retrieve all GrupoFormats from the database.
exports.findAll = async (req, res) => {
  const id = req.body.id;

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

    // Verifica se a contagem de pedidos é zero
    if (resultPedidos.length === 0) {
      res.status(200).send({
        status: true,
        message: "Data not found"
      });
    }

    // Enviando resposta com os dados de pedidos
    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        dashboard: resultPedidos,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar dados dos pedidos:", error);

    // Enviando resposta de erro
    res.status(500).send({
      status: false,
      message: "Ocorreu um erro ao buscar os dados dos pedidos",
      error: error.message, // Envia a mensagem de erro
    });
  }
};
