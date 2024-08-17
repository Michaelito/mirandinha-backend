const db = require("../models");
const Customers = db.michaelcustomers;
const Customers_address = db.michael_customers_address;
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require("uuid");

// Create and Save a new Customers
exports.create = (req, res) => {
  // Create a Customers
  const json_customers = {
    uuid: uuidv4(),
    enterprise_id: 1,
    name: req.body.name,
    birth_date: req.body.birth_date,
    gender: req.body.gender,
  };

  // Save Customers in the database
  Customers.create(json_customers)
    .then((data) => {
      const customer_id = data.id;

      const json_customers_address = {
        uuid: uuidv4(),
        enterprise_id: req.body.address.enterprise_id,
        customers_id: customer_id ,
        delivery_id: req.body.address.delivery_id,
        phone: req.body.address.phone,
        zip: req.body.address.zip,
        street: req.body.address.street,
        number: req.body.address.number,
        complement: req.body.address.complement,
        neighborhood: req.body.address.neighborhood,
        city: req.body.address.city,
        reference: req.body.address.reference,
      };

      Customers_address.create(json_customers_address);

      

      // Create a customers address

      res.status(200).send({
        status: true,
        message: "The request has succeeded",
        data: {
          customers: data,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "The request has not succeeded" + err,
        data: null,
      });
    });
};

// Retrieve all Customerss from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title
    ? {
        title: {
          [Op.like]: `%${title}%`,
        },
      }
    : null;

  Customers.findAll({ where: condition })
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

// Find a single Customers with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Customers.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Data with id=" + id,
      });
    });
};

// Update a Customers by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Customers.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Customers was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Data with id=${id}. Maybe Data was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Customers with id=" + id,
      });
    });
};
