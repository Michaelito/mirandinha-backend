const db = require("../models");
const GrupoFormat = db.grupo_format;
const SubGrupo = db.subgrupo;
const Op = db.Sequelize.Op;
const { uuid } = require("uuidv4");

// Create and Save a new GrupoFormat
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a GrupoFormat
  const payload = {
    uuid: uuid(),
    name: req.body.name,
  };

  // Save GrupoFormat in the database
  GrupoFormat.create(payload)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the GrupoFormat.",
      });
    });
};

// Retrieve all GrupoFormats from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name
    ? {
        name: {
          [Op.like]: `%${name}%`,
        },
      }
    : null;

  GrupoFormat.hasMany(SubGrupo, {
    foreignKey: "grupo_id",
  });

  GrupoFormat.findAll({
    include: [
      {
        model: SubGrupo,
        required: false,
        attributes: [["id", "id_subgrupo"], "name"],
      },
    ],

    where: { status: 1 },
  })
    .then((data) => {
      res
        .send({
          status: true,
          message: "The request has succeeded",
          data: {
            Grupos: data,
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

// Find a single Data with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  GrupoFormat.hasMany(SubGrupo, {
    foreignKey: "grupo_id",
  });

  GrupoFormat.findByPk(id, {
    include: [
      {
        model: SubGrupo,
        required: false,
        attributes: [["id", "id_subgrupo"], "name"],
      },
    ],
  })
    .then((data) => {
      res
        .send({
          status: true,
          message: "The request has succeeded",
          data: {
            Grupo: data,
          },
        })
        .status(200);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Data with id=" + id,
      });
    });
};

// Update a Data by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  GrupoFormat.update(req.body, {
    where: { id: id },
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
