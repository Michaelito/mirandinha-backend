const db = require("../models");
const Customers_address = db.michael_customers_address;
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require("uuid");

// Create and Save a new Customers
exports.create = async (req, res) => {
  // Create a Customers
  const json_customers_address = {
    uuid: uuidv4(),
    enterprise_id: req.body.address.enterprise_id,
    customers_id: 2,
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

  // Save Customers in the database
  await Customers_address.create(json_customers_address)
    .then((data) => {

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
