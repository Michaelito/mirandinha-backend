const db = require("../models");
const Products = db.produtos;
const grupos = db.grupo_format;
const GradeProdutos = db.produtos_grade;
const Op = db.Sequelize.Op;

exports.findAll = async (req, res) => {
  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  Products.hasMany(GradeProdutos, {
    foreignKey: "produto_id",
  });

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
    include: [
      {
        model: GradeProdutos,
        required: false,
        attributes: ["id", "cor_id", "cor", "hexadecimal", "img", "quantidade"],
      },
    ],
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


exports.findAllGroup = async (req, res) => {
  console.log('products all group/id')
  
  const id = req.params.id;
  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  Products.hasMany(GradeProdutos, {
    foreignKey: "produto_id",
  });

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

  const grupo = await grupos.findOne({
    where: { id: id },
  });
  
  await Products.findAndCountAll({
    include: [
      {
        model: GradeProdutos,
        required: false,
        attributes: ["id", "cor_id", "cor", "hexadecimal", "img", "quantidade"],
      },
    ],
    where: { grupo_format: id },
    limit: size,
    offset: page * size,
  })
    .then((productWithCount) => {
      if (productWithCount.count >= 1) {
        res.send({
          status: true,
          message: "The request has succeeded",
          limit: size,
          page: page,
          totalPages: Math.ceil(productWithCount.count / Number.parseInt(size)),
          grupo: grupo.name,
          subgrupo: grupo.name,
          data: {
            products: productWithCount.rows,
          },
        });
      } else {
        res.send({
          status: true,
          message: `Cannot localizar Data with id=${id}. Maybe Data was not found or empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error Data with id=" + id,
      });
    });
};

// Find a single Data with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Products.hasMany(GradeProdutos, {
    foreignKey: "produto_id",
  });

  Products.findByPk(id, {
    include: [
      {
        model: GradeProdutos,
        required: false,
        attributes: ["id", "cor_id", "cor", "hexadecimal", "img", "quantidade"],
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

// Update a Data by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Products.upsert(req.body, {
    where: { produto_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Data was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Data with id=${id}. Maybe Data was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Data with id=" + id,
      });
    });
};
