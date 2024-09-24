const db = require("../models");
const Customers = db.michaelcustomers;
const Customers_address = db.michael_customers_address;
const DeliverysValue = db.deliveryValue;
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require("uuid");

// Create and Save a new Customers
exports.create = (req, res) => {
  // Create a Customers
  const json_customers = {
    uuid: uuidv4(),
    enterprise_id: 1,
    name: req.body.name,
    email: req.body.email,
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
        customers_id: customer_id,
        delivery_id: req.body.address.delivery_id,
        phone: req.body.phone,
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

  Customers.hasMany(Customers_address, {
    foreignKey: "customers_id",
  });

  Customers.findAll({
    include: [
      {
        model: Customers_address,
        required: false,
        attributes: [
          "phone",
          "zip",
          "street",
          "number",
          "complement",
          "city",
          "neighborhood",
          "reference",
        ],
      },
    ],
    where: condition,
  })
    .then((data) => {
      res.send({
        status: true,
        message: "The request has succeeded",
        data: {
          customers: data,
        },
      });
    })
    .catch((err) => {
      res.send({
        status: false,
        message: "The request has not succeeded",
        data: null,
      });
    });
};

// Find a single Customers with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Customers.hasMany(Customers_address, {
    foreignKey: "customers_id",
  });

  Customers.findByPk(id, {
    include: [
      {
        model: Customers_address,
        required: false,
        attributes: [
          "phone",
          "zip",
          "street",
          "number",
          "complement",
          "city",
          "neighborhood",
          "reference",
        ],
      },
    ],
  })
    .then((data) => {
      res.send({
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
    .then((data) => {
      Customers_address.update(req.body.address, {
        where: { customers_id: id },
      });

      res.send({
        status: true,
        message: "Customers was updated successfully.",
        data: {
          customers: data,
        },
      });

      // if (num == 1) {
      //   res.send({
      //     status: true,
      //     message: "Customers was updated successfully.",
      //   });
      // } else {
      //   res.send({
      //     message: `Cannot update Data with id=${id}. Maybe Data was not found or req.body is empty!`,
      //   });
      // }
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "Error updating Customers with id=" + id,
      });
    });
};

exports.customerPhone = async (req, res) => {
  const phone = req.params.phone;

  const customerAddress = await Customers_address.findOne({
    where: { phone: phone },
  });

  if (!customerAddress) {
    res.status(404).send({
      status: false,
      message: "Customer not found",
    });
    return;
  }

  const customer = await Customers.findOne({
    where: { id: customerAddress.customers_id },
  });

  if (customerAddress.customers_id) {
    const valueRate = await DeliverysValue.findOne({
      where: { id: customerAddress.delivery_id },
    });
  }

  obj = {
    uuid: customer.uuid,
    name: customer.name,
    email: customer.email,
    birth_date: customer.birth_date,
    gender: customer.gender,
    phone: customer.phone,
    address: {
      zip: customerAddress.zip,
      rate_value: valueRate.valor_taxa ? valueRate.valor_taxa : 0,
      street: customerAddress.street,
      number: customerAddress.number,
      complement: customerAddress.complement,
      city: customerAddress.city,
      neighborhood: customerAddress.neighborhood,
      reference: customerAddress.reference,
    },
  };

  try {
    res.send({
      status: true,
      message: "The request has succeeded",
      data: {
        customer: obj,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error retrieving Data with id=" + id,
    });
  }
};
