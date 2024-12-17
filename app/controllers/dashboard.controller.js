const sequelize = require("../config/database");
const db = require("../models");
const Pedidos = db.pedidos;
const { fn, col, Op } = require("sequelize");
const { decodeTokenFromHeader } = require('../middleware/auth.js');

// Retrieve all GrupoFormats from the database.
exports.findOne = async (req, res) => {
  const user_id = req.params.id;
  const currentYear = new Date().getFullYear();
  const decodedToken = decodeTokenFromHeader(req);
  const id_empresa = decodedToken.id_empresa;


  try {

    const dashboard = await sequelize.query(
      `SELECT 
         DATE_FORMAT(createdAt, '%Y') AS year,
         DATE_FORMAT(createdAt, '%m') AS month,
         COUNT(id) AS count_orders,
         SUM(total_geral) AS sum_total_orders
       FROM 
         pedidos
       WHERE 
         id_empresa = :id_empresa AND DATE_FORMAT(createdAt, '%Y') = :currentYear
       GROUP BY 
         id_empresa,
         DATE_FORMAT(createdAt, '%Y'),
         DATE_FORMAT(createdAt, '%m')
       ORDER BY 
         DATE_FORMAT(createdAt, '%Y-%m') ASC;`,
      {
        replacements: { id_empresa: id_empresa, currentYear: currentYear },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const totalData = await sequelize.query(
      `SELECT 
         COUNT(id) AS qtde_total,
         SUM(total_geral) AS total
       FROM 
         pedidos
       WHERE 
         id_empresa = :id_empresa AND DATE_FORMAT(createdAt, '%Y') = :currentYear;`,
      {
        replacements: { id_empresa: id_empresa, currentYear: currentYear },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (dashboard.length === 0) {
      return res.status(404).send({ message: "Data not found" });
    }

    const { qtde_total, total } = totalData[0];

    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        customer_since: "2024-01-01",
        qtde_total: qtde_total,
        total: total,
        dashboard: dashboard
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
    });
  }
};





//   // Consulta para somar quantidade e soma total por mês e ano
//   const resultPedidos = await Pedidos.findAll({
//     attributes: [
//       [fn("DATE_FORMAT", col("createdAt"), "%Y"), "year"],
//       [fn("DATE_FORMAT", col("createdAt"), "%m"), "month"],
//       [fn("COUNT", col("id")), "count_orders"],
//       [fn("SUM", col("total_geral")), "sum_total_orders"],
//     ],
//     where: {
//       user_id: id, // Condição específica (opcional)
//     },
//     group: [
//       "user_id",
//       fn("DATE_FORMAT", col("createdAt"), "%Y"),
//       fn("DATE_FORMAT", col("createdAt"), "%m"),
//     ], // Agrupa por ano e mês
//     order: [[fn("DATE_FORMAT", col("createdAt"), "%Y-%m"), "ASC"]],
//   });

//   // Validate if there are any records in resultPedidos
//   if (resultPedidos.length === 0) {
//     // If no records were found, send a "No records" response
//     return res
//       .status(404)
//       .json({ message: "No orders found for this user." });
//   } else {
//     // Enviando resposta com os dados de pedidos
//     res.status(200).send({
//       status: true,
//       message: "The request has succeeded",
//       data: {
//         dashboard: resultPedidos,
//       },
//     });
//   }
// } catch (error) {
//   // Enviando resposta de erro
//   res.status(500).send({
//     status: false,
//     message: "Ocorreu um erro ao buscar os dados dos pedidos",
//     error: error.message, // Envia a mensagem de erro
//   });
// }
///};
