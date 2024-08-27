const db = require("../models");
const sequelize = require("../config/database");

// Create and Save a new GrupoFormat

// Find a single Data with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  const results = await sequelize.query(
    "SELECT  DISTINCT g.id, g.nome nome FROM produtos p JOIN grupos g ON g.id = p.id_grupo1 WHERE p.grupo_format = " + id,
    {
      replacements: { status: 1 },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  res.status(200).send({
    status: true,
    message: "The request has succeeded",
    data: {
      dashboard: results,
    },
  });
};
