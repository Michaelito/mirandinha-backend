const db = require("../models");
const Clientes = db.clientes;
const Users = db.users;
const Op = db.Sequelize.Op;
const jsonxml = require('jsonxml');
const clienteSchema = require('../validation/clienteValidator');
const crypto = require("crypto");
const { uuid } = require("uuidv4");


const sequelize = require("../config/database");

exports.findAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.params.search || ""; // Get the search parameter

  console.log("Search parameter:", search);

  try {
    // Build WHERE clause based on the search parameter
    let whereClause = "";
    let replacements = [limit, offset];

    if (search) {
      whereClause = `WHERE razao_social LIKE ? OR nome_fantasia LIKE ? OR cnpj LIKE ?`;
      const searchParam = `%${search}%`;
      replacements = [searchParam, searchParam, searchParam, limit, offset];
    }

    // Query to get the total count of products for pagination
    const totalQuery = await sequelize.query(
      `SELECT COUNT(*) as total FROM clientes ${whereClause}`,
      {
        replacements: search ? [replacements[0], replacements[1], replacements[2]] : [],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const totalQueryQtde = totalQuery[0]?.total || 0;

    // Query to fetch the paginated products
    const query = await sequelize.query(
      `SELECT id, id_exsam, razao_social, nome_fantasia, cnpj, 
       endereco, numero, complemento, cidade, uf, 
       id_tabpre, id_forma_pagamento, id_pagamento, id_trasnportador, id_vendedor 
       FROM clientes
       ${whereClause}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (query.length === 0) {
      return res.status(200).send({ message: "DATA NOT FOUND" });
    }

    // Return data with pagination
    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        customers: query,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: totalQueryQtde,
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
      error: error.message, // Included error message for debugging
    });
  }
};


exports.create = async (req, res) => {

  const { error, value } = clienteSchema.validate(req.body);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  try {

    const cnpjExists = await Clientes.findOne({ where: { cnpj: value.cnpj } });

    const emailExists = await Users.findOne({ where: { login: value.email } });

    if (emailExists) {
      return res.status(400).send({ error: 'E-MAIL already exists' });
    }

    if (cnpjExists) {
      return res.status(400).send({ error: 'CNPJ already exists' });
    }

    const novoCliente = await Clientes.create(req.body);
    const md5Hash = crypto.createHash("md5");
    md5Hash.update(value.password);
    const password_md5 = md5Hash.digest("hex");

    const cnpjLimpo = value.cnpj.replace(/\D/g, "");

    const payload = {
      uuid: uuid(),
      login: value.email,
      id_empresa: novoCliente.id,
      password: password_md5,
      profile: cnpjLimpo.length > 11 ? 2 : 1
    };

    await Users.create(payload);

    res.send({
      status: true,
      message: "The request has succeeded",
      data: {
        clientes: novoCliente,
      },
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }

};

// Find a single Data with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {

    // Query to fetch the paginated products
    const query = await sequelize.query(
      `SELECT id, id_exsam, razao_social, nome_fantasia, cnpj, 
       endereco, numero, complemento, cidade, uf, 
       id_tabpre, id_forma_pagamento, id_pagamento, id_trasnportador, id_vendedor 
       FROM clientes
       WHERE id = ?`,
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (query.length === 0) {
      return res.status(200).send({ message: "DATA NOT FOUND" });
    }

    // Return data with pagination
    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        customer: query[0],
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
      error: error.message, // Included error message for debugging
    });
  }
};

// Update a Data by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Clientes.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Data was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Data with id=${id}. Maybe Data was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Data with id=" + id
      });
    });
};