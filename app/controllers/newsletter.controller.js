const db = require("../models");
const Newsletter = db.newsletter;
const Op = db.Sequelize.Op;

// Create and Save a new Newsletter
exports.create = (req, res) => {
  // Create a Newsletter
  const json = {
    title: req.body.title,
    description: req.body.description,
    img: req.body.img,
    video: req.body.video,
  };

  // Save Newsletter in the database
  Newsletter.create(json)
    .then((data) => {
      res.status(200).send({
        status: true,
        message: "The request has succeeded",
        data: {
          users: data,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message:
          err.message || "Some error occurred while creating the Newsletter.",
        data: null,
      });
    });
};

// Retrieve all Newsletters from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title
    ? {
        title: {
          [Op.like]: `%${title}%`,
        },
      }
    : null;

  Newsletter.findAll({ where: condition })
    .then((data) => {
      res.status(200).send({
        status: true,
        message: "The request has succeeded",
        data: {
          newslwtter: data,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "The request has not succeeded",
        data: null,
      });
    });
};

// Find a single Newsletter with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Newsletter.findByPk(id)
    .then((data) => {
      res.status(200).send({
        status: true,
        message: "The request has succeeded",
        data: {
          newslwtter: data,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "Error retrieving Newsletter with id=" + id,
      });
    });
};

