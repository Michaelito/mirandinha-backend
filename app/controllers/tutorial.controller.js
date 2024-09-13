const db = require("../models");
const Tutorial = db.tutorials;
const Products = db.produtos;
const User = db.users;
const Cliente = db.clientes
const sequelize = require("../config/database");
const Op = db.Sequelize.Op;

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
        { id_exsam: { [Op.like]: `%${nome}%` } }, // buscando também na coluna 'codigo' com o mesmo parâmetro 'nome'
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
            tutorial: data,
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
exports.findOne = async (req, res) => {
  const id = req.params.id;
  const uuid = req.params.uuid;


  const tabpreco = await sequelize.query(
    "select t.fator from clientes c join users u on u.empresa_id = c.id join tabpreco t on t.id = c.id_tabpre where u.uuid = '" +
    uuid +"'",
    {
      type: sequelize.QueryTypes.SELECT,
    }
  );


  Products.findByPk(id)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "Product not found with id=" + id,
        });
      }



      // Modify the data as needed
      const modifiedData = {
        ...data.dataValues, // Extract data values from Sequelize object
        preco: data.preco, 
        precoxtabpreco: tabpreco[0].fator * data.preco,
        // Add or modify other fields as needed
      };

      res.send(modifiedData);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Product with id=" + id,
      });
    });
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
