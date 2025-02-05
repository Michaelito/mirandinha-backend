const db = require("../models");
const Tutorial = db.tutorials;
const Products = db.produtos;
const User = db.users;
const Cliente = db.clientes;
const sequelize = require("../config/database");
const Op = db.Sequelize.Op;
const grupos = db.grupo_format;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Tutorial
  const tutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  };

  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const nome = req.query.nome;

  var condition = {};

  if (nome) {
    condition = {
      [Op.or]: [
        { nome: { [Op.like]: `%${nome}%` } },
        { id_exsam: { [Op.like]: `%${nome}%` } },
      ],
    };
  }

  Products.findAll({ where: condition })
    .then((data) => {
      res
        .send({
          status: true,
          message: "The request has succeeded",
          data: {
            produtos: data,
          },
        })
        .status(200);
    })
    .catch((err) => {
      res
        .send({
          status: false,
          message: "The request has not succeeded",
          data: null,
        })
        .status(500);
    });
};

// Find a single Tutorial with an id
exports.findAllSubGroup = async (req, res) => {
  const { search } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const offset = (page - 1) * limit;

  try {
    const products = await sequelize.query(
      `SELECT DISTINCT id, id_grupo, nome, descricao, preco, preco_pf, video, aplicacao, manual_tecnico, qrcode
       FROM produtos
       WHERE id_subgrupo = ? OR nome LIKE ?
       ORDER BY nome ASC
       LIMIT ? OFFSET ?`,
      {
        replacements: [search, `%${search}%`, limit, offset],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (products.length === 0) {
      return res.status(200).send({ message: "Produto não encontrado" });
    }

    const grupo = await sequelize.query(
      `SELECT name FROM grupo_formats WHERE id = ${products[0].id_grupo}`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const nomeGrupo = grupo.length > 0 ? grupo[0].name.toUpperCase() : 'Grupo não encontrado';

    const subgrupo = await sequelize.query(
      `SELECT nome FROM grupos WHERE id = ?`,
      {
        replacements: [search],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const nomeSubGrupo = subgrupo.length > 0 ? subgrupo[0].nome.toUpperCase() : 'Sub Grupo não encontrado';

    for (const product of products) {
      const productGrade = await sequelize.query(
        "SELECT id_exsam, grade, hexadecimal, img FROM produtos_grades WHERE id_produto = ? ORDER BY grade ASC",
        {
          replacements: [product.id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      product.produtos_grades = productGrade;
    }

    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        grupo: nomeGrupo,
        subgrupo: nomeSubGrupo,
        products: products,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: products.length,
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
    });
  }
};




// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Tutorial.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tutorial was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id,
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};

// find all published Tutorial
exports.findAllPublished = (req, res) => {
  Tutorial.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
