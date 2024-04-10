const db = require("../models");
const Products = db.product;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
  const grupo = req.body.grupo;

  // Example raw SQL query to retrieve all rows from 'estoque' table
  db.sequelize
    .query(
      "SELECT g.id, g.nome, p.* FROM produtos p LEFT JOIN grupos g ON g.id = p.id_grupo1 WHERE g.nome = '" +
        grupo +
        "'",
      {
        type: db.Sequelize.QueryTypes.SELECT,
      }
    )
    .then((data) => {
      res.status(200).send({
        status: true,
        products: data,
      });
    })
    .catch((error) => {
      res.status(500).send({
        message: "Error retrieving Data with id=" + id,
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Products.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Data with id=" + id,
      });
    });
};


