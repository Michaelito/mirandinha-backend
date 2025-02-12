require("dotenv").config(); // Para gerenciar variáveis de ambiente
const db = require("../models");
const users = db.users;
const address_users = db.address_users;
const Op = db.Sequelize.Op;
const { uuid } = require("uuidv4");
const crypto = require("crypto");
const sequelize = require("../config/database");
const { decodeTokenFromHeader } = require('../middleware/auth.js');

const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name
    ? {
      name: {
        [Op.like]: `%${name}%`,
      },
    }
    : null;

  users.hasOne(address_users, {
    foreignKey: "user_id",
  });

  users
    .findAll({
      where: condition,
      attributes: { exclude: ["password", "token", "refresh_token"] },
      include: [
        {
          model: address_users,
          required: false,
          attributes: [
            "id",
            "cep",
            "logradouro",
            "numero",
            "complemento",
            "cidade",
            "bairro",
            "estado",
            "ativo",
            "createdAt",
          ],
        },
      ],
    })
    .then((data) => {
      res
        .send({
          status: true,
          message: "The request has succeeded",
          data: {
            users: data,
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
  const decodedToken = decodeTokenFromHeader(req);

  const userId = decodedToken.profile === 1 ? id : decodedToken.id;

  try {
    // Consulta para buscar o pedido específico
    const users = await sequelize.query(
      `SELECT u.id, u.login, u.id_empresa, u.profile, u.fullname, u.document, u.ddi, u.ddd, u.phone, u.phone, u.status, u.createdAt
       FROM users u 
       WHERE u.id = ?`,
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (users.length === 0) {
      return res.status(200).send({
        status: false,
        message: "DATA NOT FOUND",
      });
    }

    const user = users[0];

    const customerId = decodedToken.profile === 1 ? user.id_empresa : decodedToken.id_empresa;
    // // Consultar os itens do pedido
    const companies = await sequelize.query(
      `SELECT id, id_exsam, lj, razao_social, nome_fantasia, cnpj, endereco, numero, complemento, cidade, uf, 
      id_tabpre, id_forma_pagamento, id_pagamento, id_vendedor, tipo_entrega
      FROM clientes 
      WHERE id = ?`,
      {
        replacements: [customerId],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    user.company = companies[0];

    if (decodedToken.profile === 4) {

      const companies_representantes = await sequelize.query(
        `SELECT 
        c.id, c.id_exsam, c.lj, c.razao_social, c.nome_fantasia, c.cnpj, c.endereco, c.numero, c.complemento, c.cidade, c.uf, 
        c.id_tabpre, c.id_forma_pagamento, c.id_pagamento, c.tipo_entrega, c.id_vendedor
        FROM representantes_clientes rc
        JOIN clientes c ON c.id = rc.id_clientes  
        WHERE rc.id_users = ?`,
        {
          replacements: [decodedToken.id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      user.customers = companies_representantes
    }

    // Retornar o pedido com os itens
    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        user: user, // Retorna o pedido único
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
    });
  }

};

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.login) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }



  // Create an MD5 hash object
  const md5Hash = crypto.createHash("md5");

  // Update the hash object with the password
  md5Hash.update(req.body.password);

  // Get the hexadecimal representation of the hash
  const password_md5 = md5Hash.digest("hex");

  const payload = {
    uuid: uuid(),
    login: req.body.login,
    id_empresa: req.body.id_empresa,
    password: req.body.password
      ? password_md5
      : "25d55ad283aa400af464c76d713c07ad",
    profile: req.body.profile,
  };

  // Save Tutorial in the database
  users
    .create(payload)
    .then((data) => {
      const last_id = data.id;

      const type = req.body.document > 11 ? 1 : 2;

      const payload_data = {
        uuid: uuid(),
        user_id: last_id,
        document: req.body.document,
        fullname: req.body.fullname,
        phone: req.body.phone,
        cellphone: req.body.cellphone,
        type: type,
        birthdate: req.body.birthdate,
      };

      datausers.create(payload_data);
      res.send(data);
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating data.",
      });
    });
};

exports.update_password = async (req, res) => {
  try {
    const userId = req.params.id; // Obter o ID do usuário da URL
    const { pass_old, pass_new } = req.body; // Obter as senhas do corpo da requisição

    // Validar se os campos necessários estão presentes
    if (!pass_old || !pass_new) {
      return res.status(400).send({ message: "As senhas antiga e nova são obrigatórias." });
    }

    // Gerar o hash da senha antiga fornecida
    const hashOldPassword = crypto.createHash("md5").update(pass_old).digest("hex");

    // Buscar o usuário no banco de dados
    const user = await users.findOne({ where: { id: userId } });

    if (!user) {
      res.status(400).send({
        status: true,
        message: "DATA NOT FOUND",
      });
    }

    // Validar se a senha antiga fornecida confere com a armazenada
    if (user.password !== hashOldPassword) {
      res.status(401).send({
        status: false,
        message: "the current password does not match",
      });
    }

    // Gerar o hash da nova senha
    const hashNewPassword = crypto.createHash("md5").update(pass_new).digest("hex");

    // Atualizar a senha do usuário no banco de dados
    await user.update({ password: hashNewPassword });

    // Retornar sucesso
    res.status(200).send({
      status: true,
      message: "The request has succeeded",
    });

  } catch (error) {
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
    });
  }
};
// Update User in database
exports.update = (req, res) => {
  const id = req.params.id;

  try {

    users.update(req.body, {
      where: { id: id },
    });

    res.send({
      message: "Data was updated successfully.",
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error updating category with id=" + id,
    });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;
  try {
    const num = users.destroy({
      where: { id: id },
    });

    if (num == 1) {
      res.send({
        message: "Data was deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete Data with id=${id}. Maybe Data was not found!`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Data with id=" + id,
    });
  }
};

const generateRandomPassword = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};


exports.forgot_password = async (req, res) => {
  console.log("")
  const login = req.body.login;

  try {
    // Consulta para buscar o pedido específico
    const users = await sequelize.query(
      `SELECT u.id, u.fullname, u.login 
      FROM users u 
      WHERE u.login = ?`,
      {
        replacements: [login],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (users.length === 0) {
      return res.status(200).send({
        status: false,
        message: "DATA NOT FOUND",
      });
    }

    const user = users[0];
    const pass_new = generateRandomPassword(8);
    const hashNewPassword = crypto.createHash("md5").update(pass_new).digest("hex");

    await sequelize.query(
      `UPDATE users 
       SET password = ? 
       WHERE id = ?`,
      {
        replacements: [hashNewPassword, user.id],
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    const htmlFilePath = path.join(__dirname, '../views/index.html');
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

    htmlContent = htmlContent
      .replace('{{USERNAME}}', user.fullname)
      .replace('{{PASSWORD}}', pass_new);


    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      //host: "mail.portalmirandinha.com.br",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Grupo Mirandinha" <suporte@portalmirandinha.com.br>',
      to: user.login,
      subject: "Recuperação de Senha",
      text: `Olá ${user.login},\n\nVocê solicitou a recuperação de sua senha.`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).send({
      status: true,
      message: "The request has succeeded",
    });


  } catch (error) {

    console.log("Erro ao processar requisição de recuperação de senha:", error);

    return res.status(500).send({
      status: false,
      message: error.message || "The request has not succeeded",
    });

  }
};
