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
  const id_user = decodedToken.id;


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
         id_user = :id_user AND DATE_FORMAT(createdAt, '%Y') = :currentYear
       GROUP BY 
         id_user,
         DATE_FORMAT(createdAt, '%Y'),
         DATE_FORMAT(createdAt, '%m')
       ORDER BY 
         DATE_FORMAT(createdAt, '%Y-%m') ASC;`,
      {
        replacements: { id_user: id_user, currentYear: currentYear },
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
         id_user = :id_user AND DATE_FORMAT(createdAt, '%Y') = :currentYear;`,
      {
        replacements: { id_user: id_user, currentYear: currentYear },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (dashboard.length === 0) {
      return res.status(200).send({ message: "DATA NOT FOUND" });
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





