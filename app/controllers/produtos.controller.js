const db = require("../models");
const Products = db.produtos;
const Estoque = db.estoque;
const Op = db.Sequelize.Op;

exports.findAll = async (req, res) => {
  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  let page = 0;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
    page = pageAsNumber;
  }

  let size = 20;

  if (
    !Number.isNaN(sizeAsNumber) &&
    !(sizeAsNumber > 50) &&
    !(sizeAsNumber < 1)
  ) {
    size = sizeAsNumber;
  }
  const productWithCount = await Products.findAndCountAll({
    limit: size,
    offset: page * size,
  });
  res.send({
    status: true,
    message: "The request has succeeded",
    limit: size,
    page: page,
    totalPages: Math.ceil(productWithCount.count / Number.parseInt(size)),
    data: {
      products: productWithCount.rows,
    },
  });
};

exports.findAllGroup = (req, res) => {
  const id = req.params.id;

  Products.hasOne(Estoque, {
    foreignKey: "id",
  });

  Products.findAll({ where: { id_grupo1: id } })
    .then((data) => {
      res.send({
        status: true,
        message: "The request has succeeded",
        data: {
          products: data,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Products.hasOne(Estoque, {
    foreignKey: "id",
  });

  Products.findByPk(id, {
    include: [
      {
        model: Estoque,
        required: false,
        attributes: ["fil", "estoque", "empenho", "disponivel"],
      },
    ],
  })
    .then((data) => {
      res.send({
        status: true,
        message: "The request has succeeded",
        data: {
          product: data,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "Error retrieving Data with id=" + id,
      });
    });
};