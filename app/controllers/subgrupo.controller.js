const db = require("../models");
const sequelize = require("../config/database");

// Create and Save a new GrupoFormat

// Find a single Data with an id
exports.findOne = async (req, res) => {
  try {
    // Verifica se o parâmetro id é fornecido e válido, caso contrário, define como 394
    const id = req.params.id ? req.params.id : 394;

    const results = await sequelize.query(
      "SELECT DISTINCT g.id, g.nome nome FROM produtos p JOIN grupos g ON g.id = p.id_subgrupo WHERE p.id_grupo = " +
      id,
      {
        replacements: { status: 1 },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        subgrupos: results,
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    res.status(500).send({
      status: false,
      message: "An error occurred while processing your request.",
      error: error.message,
    });
  }
};
