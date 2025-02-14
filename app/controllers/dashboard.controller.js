const sequelize = require("../config/database");
const db = require("../models");
const Pedidos = db.pedidos;
const { fn, col, Op } = require("sequelize");
const { decodeTokenFromHeader } = require('../middleware/auth.js');

// Retrieve all GrupoFormats from the database.
exports.findAll = async (req, res) => {
  const decodedToken = decodeTokenFromHeader(req);
  const id_empresa = decodedToken.id_empresa;

  try {
    // 1. Extract and Validate Parameters
    const currentYear = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    const month = req.query.month ? parseInt(req.query.month) : null;
    const id_vendedor = req.query.id_vendedor;

    // 2. Build the WHERE Clause Dynamically
    const whereClauses = [];
    const replacements = {
      currentYear,
      id_empresa
    };

    if (month) {
      whereClauses.push("DATE_FORMAT(createdAt, '%m') = :month");
      replacements.month = month;
    }

    if (id_vendedor) {
      whereClauses.push("id_user = :id_vendedor");
      replacements.id_vendedor = id_vendedor;
    }

    whereClauses.push("DATE_FORMAT(createdAt, '%Y') = :currentYear");
    whereClauses.push("id_empresa = :id_empresa");

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // 3. Construct the SQL Query for dashboard data
    const dashboardQuery = `
      SELECT
        DATE_FORMAT(createdAt, '%Y') AS year,
        DATE_FORMAT(createdAt, '%m') AS month,
        COUNT(id) AS count_orders,
        SUM(total_geral) AS sum_total_orders
      FROM
        pedidos
      ${whereClause}
      GROUP BY
        DATE_FORMAT(createdAt, '%Y'),
        DATE_FORMAT(createdAt, '%m')
      ORDER BY
        DATE_FORMAT(createdAt, '%Y-%m') ASC;
    `;

    const [dashboardData, metadataDashboard] = await sequelize.query(dashboardQuery, {
      replacements: replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    // 4. Construct the SQL Query for total data
    const sqlQuery = `
      SELECT 
        COUNT(id) AS total_pedidos,
        SUM(total_geral) AS total_valor
      FROM 
        pedidos
      ${whereClause};
    `;

    const [totalData, metadataTotal] = await sequelize.query(sqlQuery, {
      replacements: replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    // 5. Extract and Send the Response
    const {
      total_pedidos,
      total_valor
    } = totalData[0] || {
      total_pedidos: 0,
      total_valor: 0
    };

    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        total_pedidos: total_pedidos || 0,
        total_valor: total_valor || 0,
        dashboard: dashboardData || []
      },
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
    });
  }
};





