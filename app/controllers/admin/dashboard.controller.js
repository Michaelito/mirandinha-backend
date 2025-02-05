const sequelize = require("../../config/database");
const { decodeTokenFromHeader } = require('../../middleware/auth.js');

// // Retrieve all GrupoFormats from the database.
// exports.findAll = async (req, res) => {
//   const decodedToken = decodeTokenFromHeader(req);
//   const profile = decodedToken.profile;

//   if (profile !== 1) {
//     return res.status(401).send({ status: true, message: "UNAUTHORIZED" });
//   }

//   const currentYear = new Date().getFullYear();
//   const currentMonth = new Date().getMonth(); // Mês atual (0-11)
//   const startDate = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
//   const endDate = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

//   try {
//     const dashboard = await sequelize.query(
//       `SELECT 
//          DATE_FORMAT(createdAt, '%Y') AS year,
//          DATE_FORMAT(createdAt, '%m') AS month,
//          COUNT(id) AS count_orders,
//          SUM(total_geral) AS sum_total_orders
//        FROM 
//          pedidos
//        WHERE 
//          createdAt BETWEEN :startDate AND :endDate
//        GROUP BY 
//          DATE_FORMAT(createdAt, '%Y'),
//          DATE_FORMAT(createdAt, '%m')
//        ORDER BY 
//          DATE_FORMAT(createdAt, '%Y-%m') ASC;`,
//       {
//         replacements: { startDate, endDate },
//         type: sequelize.QueryTypes.SELECT,
//       }
//     );

//     const totalData = await sequelize.query(
//       `SELECT 
//          COUNT(id) AS qtde_total,
//          SUM(total_geral) AS total
//        FROM 
//          pedidos
//        WHERE 
//          createdAt BETWEEN :startDate AND :endDate;`,
//       {
//         replacements: { startDate, endDate },
//         type: sequelize.QueryTypes.SELECT,
//       }
//     );

//     // Query for original status counts
//     const statusCounts = await sequelize.query(
//       `SELECT 
//          status, 
//          COUNT(id) AS count_status
//        FROM 
//          pedidos
//        WHERE 
//          createdAt BETWEEN :startDate AND :endDate
//        GROUP BY 
//          status;`,
//       {
//         replacements: { startDate, endDate },
//         type: sequelize.QueryTypes.SELECT,
//       }
//     );

//     // Query for status_convert counts
//     const statusConvertCounts = await sequelize.query(
//       `SELECT 
//         COUNT(id) AS count_status_convert
//        FROM 
//          pedidos
//        WHERE 
//          createdAt BETWEEN :startDate AND :endDate;`,
//       {
//         replacements: { startDate, endDate },
//         type: sequelize.QueryTypes.SELECT,
//       }
//     );

//     if (dashboard.length === 0) {
//       return res.status(200).send({ message: "DATA NOT FOUND" });
//     }

//     const { qtde_total, total } = totalData[0];

//     res.status(200).send({
//       status: true,
//       message: "The request has succeeded",
//       data: {
//         customer_since: "2024-01-01",
//         qtde_total,
//         total,
//         dashboard,
//         status_counts: statusCounts,
//         status_convert_counts: statusConvertCounts[0].count_status_convert,
//       },
//     });
//   } catch (error) {
//     res.status(500).send({
//       status: false,
//       message: "The request has not succeeded",
//       error: error.message,
//     });
//   }
// };

exports.findAll = async (req, res) => {
  console.log("-------endDate--------");

  const { startDate, endDate, status, id_empresa, id_user } = req.query;

  console.log('startDate:', startDate); // Deve imprimir "2025-01-01"
  console.log('endDate:', endDate);     // Deve imprimir "2025-02-01"
  console.log('status:', status);

  const decodedToken = decodeTokenFromHeader(req);
  const profile = decodedToken.profile;

  if (profile !== 1) {
    return res.status(401).send({ status: true, message: "UNAUTHORIZED" });
  }

  if (!startDate || !endDate) {
    return res.status(400).send({ status: false, message: "Start date and end date are required." });
  }

  try {
    let baseQuery = `
      SELECT 
        DATE(createdAt) AS date,
        COUNT(id) AS count_orders,
        SUM(total_geral) AS sum_total_orders
      FROM 
        pedidos
      WHERE 
        CAST(createdAt AS DATE) BETWEEN :startDate AND :endDate`;

    const replacements = { startDate, endDate };

    if (status) {
      baseQuery += ` AND status = :status`;
      replacements.status = status;
    }

    if (id_empresa) {
      baseQuery += ` AND id_empresa = :id_empresa`;
      replacements.id_empresa = id_empresa;
    }

    if (id_user) {
      baseQuery += ` AND id_user = :id_user`;
      replacements.id_user = id_user;
    }

    baseQuery += `
      GROUP BY 
        DATE(createdAt)
      ORDER BY 
        DATE(createdAt) ASC;`;

    const dashboard = await sequelize.query(baseQuery, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    const totalData = await sequelize.query(
      `SELECT 
         COUNT(id) AS qtde_total,
         SUM(total_geral) AS total
       FROM 
         pedidos
       WHERE 
         CAST(createdAt AS DATE) BETWEEN :startDate AND :endDate` +
      (status ? ' AND status = :status' : '') +
      (id_empresa ? ' AND id_empresa = :id_empresa' : '') +
      (id_user ? ' AND id_user = :id_user' : '') + ';',
      {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const statusCounts = await sequelize.query(
      `SELECT 
         status, 
         COUNT(id) AS count_status
       FROM 
         pedidos
       WHERE 
         CAST(createdAt AS DATE) BETWEEN :startDate AND :endDate` +
      (status ? ' AND status = :status' : '') +
      (id_empresa ? ' AND id_empresa = :id_empresa' : '') +
      (id_user ? ' AND id_user = :id_user' : '') + `
       GROUP BY 
         status;`,
      {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const statusConvertCounts = await sequelize.query(
      `SELECT 
        COUNT(id) AS count_status_convert
       FROM 
         pedidos
       WHERE 
         CAST(createdAt AS DATE) BETWEEN :startDate AND :endDate` +
      (' AND status_convert = 1 ') +
      (status ? ' AND status = :status' : '') +
      (id_empresa ? ' AND id_empresa = :id_empresa' : '') +
      (id_user ? ' AND id_user = :id_user' : '') + ';',
      {
        replacements,
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






