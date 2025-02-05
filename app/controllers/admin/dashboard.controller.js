const sequelize = require("../../config/database");
const { decodeTokenFromHeader } = require('../../middleware/auth.js');

// Retrieve all GrupoFormats from the database.
exports.findAll = async (req, res) => {
  const decodedToken = decodeTokenFromHeader(req);
  const profile = decodedToken.profile;

  if (profile !== 1) {
    return res.status(401).send({ status: true, message: "UNAUTHORIZED" });
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // Mês atual (0-11)
  const startDate = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
  const endDate = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

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
         createdAt BETWEEN :startDate AND :endDate
       GROUP BY 
         DATE_FORMAT(createdAt, '%Y'),
         DATE_FORMAT(createdAt, '%m')
       ORDER BY 
         DATE_FORMAT(createdAt, '%Y-%m') ASC;`,
      {
        replacements: { startDate, endDate },
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
         createdAt BETWEEN :startDate AND :endDate;`,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Query for original status counts
    const statusCounts = await sequelize.query(
      `SELECT 
         status, 
         COUNT(id) AS count_status
       FROM 
         pedidos
       WHERE 
         createdAt BETWEEN :startDate AND :endDate
       GROUP BY 
         status;`,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Query for status_convert counts
    const statusConvertCounts = await sequelize.query(
      `SELECT 
        COUNT(id) AS count_status_convert
       FROM 
         pedidos
       WHERE 
         createdAt BETWEEN :startDate AND :endDate;`,
      {
        replacements: { startDate, endDate },
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
        qtde_total,
        total,
        dashboard,
        status_counts: statusCounts,
        status_convert_counts: statusConvertCounts[0].count_status_convert,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
      error: error.message,
    });
  }
};




