const sequelize = require("../config/database");
const db = require("../models");
const Pedidos = db.pedidos;
const { fn, col, Op } = require("sequelize");
const { decodeTokenFromHeader } = require('../middleware/auth.js');

// Retrieve all GrupoFormats from the database.
exports.findAll = async (req, res) => {
  const decodedToken = decodeTokenFromHeader(req);
  const id_empresa = decodedToken.id_empresa

  // Check user authorization
  // if (decodedToken.profile != 1) {
  //   return res.status(401).send({
  //     status: false,
  //     message: "The request has not succeeded",
  //   });
  // }

  try {
    // Extract and Validate Parameters
    const currentYear = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    const month = req.query.month ? parseInt(req.query.month) : null; // Use null for no month
    const { id_vendedor } = req.query;

    // Build the WHERE Clause Dynamically
    const whereClauses = [];
    const replacements = { currentYear }; // Start with currentYear

    if (month) {
      whereClauses.push("DATE_FORMAT(createdAt, '%m') = :month");
      replacements.month = month;
    }

    whereClauses.push("id_empresa = :id_empresa");
    replacements.id_empresa = id_empresa;


    if (id_vendedor) {
      whereClauses.push("id_user = :id_vendedor");
      replacements.id_vendedor = id_vendedor;
    }

    whereClauses.push("DATE_FORMAT(createdAt, '%Y') = :currentYear");

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""; // Construct the full WHERE clause

    // Construct the SQL Query for dashboard data
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
        DATE_FORMAT(createdAt, '%Y-%m') ASC;`;

    const totalDashboard = await sequelize.query(dashboardQuery, {
      replacements: replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (totalDashboard.length === 0) {
      return res.status(200).send({
        status: false,
        message: "DATA NOT FOUND",
      });
    }

    // Construct the SQL Query for total data
    const sqlQuery = `
      SELECT 
        COUNT(id) AS qtde_total,
        SUM(total) AS total
      FROM 
        pedidos
      ${whereClause}`;

    // Execute the Query for total data
    const totalData = await sequelize.query(sqlQuery, {
      replacements: replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        customer_since: "",
        total_pedidos: totalData[0].qtde_total || 0,
        total_valor: totalData[0].total || 0,
        dashboard: totalDashboard || [],
      },
    });

  } catch (error) {
    console.error("Error fetching data:", error); // Log the error
    if (!res.headersSent) { // Check if headers have been sent before responding with an error
      res.status(500).send({
        status: false,
        message: "The request has not succeeded",
      });
    }
  }
};





