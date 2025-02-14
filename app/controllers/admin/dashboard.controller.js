const sequelize = require("../../config/database");
const { decodeTokenFromHeader } = require('../../middleware/auth.js');

// Retrieve all GrupoFormats from the database.
exports.findAll = async (req, res) => {
  const decodedToken = decodeTokenFromHeader(req);

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
    const { id_empresa, id_vendedor } = req.query;

    // Build the WHERE Clause Dynamically
    const whereClauses = [];
    const replacements = { currentYear }; // Start with currentYear

    if (month) {
      whereClauses.push("DATE_FORMAT(createdAt, '%m') = :month");
      replacements.month = month;
    }

    if (id_empresa) {
      whereClauses.push("id_empresa = :id_empresa");
      replacements.id_empresa = id_empresa;
    }

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
        SUM(total) AS total,
        status
      FROM 
        pedidos
      ${whereClause} 
      GROUP BY status; `;

    // Execute the Query for total data
    const totalData = await sequelize.query(sqlQuery, {
      replacements: replacements,
      type: sequelize.QueryTypes.SELECT,
    });


    const sqlQueryConvert = `
    SELECT 
      SUM(status_convert) AS total_converted
    FROM 
      pedidos
    ${whereClause}`;

    // Execute the Query for total data
    const datasqlQueryConvert = await sequelize.query(sqlQueryConvert, {
      replacements: replacements,
      type: sequelize.QueryTypes.SELECT,
    });


    // Extract and Send the Response
    const { total_pedidos, total_valor } = totalData[0];

    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        customer_since: "",
        total_pedidos: total_pedidos || 0,
        total_valor: total_valor || 0,
        dashboard: totalDashboard || [],
        status_counts: totalData,
        status_convert_counts: datasqlQueryConvert[0].total_converted

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


