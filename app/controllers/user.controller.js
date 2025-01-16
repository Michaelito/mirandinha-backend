require("dotenv").config(); // Para gerenciar variáveis de ambiente
const db = require("../models");
const users = db.users;
const datausers = db.data_users;
const address_users = db.address_users;
const Op = db.Sequelize.Op;
const { uuid } = require("uuidv4");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { console } = require("inspector");


// Create and Save a new Tutorial

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

  users.hasOne(datausers, {
    foreignKey: "user_id",
  });

  users.hasOne(address_users, {
    foreignKey: "user_id",
  });

  users
    .findAll({
      where: condition,
      attributes: { exclude: ["password", "token", "refresh_token"] },
      include: [
        {
          model: datausers,
          required: false,
          attributes: [
            "fullname",
            "document",
            "type",
            "rg_ie",
            "phone",
            "cellphone",
            "birthdate",
            "createdAt",
          ],
        },
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
exports.findOne = (req, res) => {
  const id = req.params.id;

  const datauser = datausers.findOne({
    where: { user_id: id },
  });

  users.hasOne(datausers, {
    foreignKey: "user_id",
  });

  users.hasMany(address_users, {
    foreignKey: "user_id",
    order: [["ativo", "ASC"]],
  });

  users
    .findByPk(id, {
      attributes: { exclude: ["password", "token", "refresh_token"] },
      include: [
        {
          model: datausers,
          required: false,
          attributes: [
            "fullname",
            "document",
            "type",
            "rg_ie",
            "phone",
            "cellphone",
            "birthdate",
            "createdAt",
          ],
        },
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
            user: data,
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
    empresa_id: req.body.empresa_id,
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
        message: "Data not found",
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
    // users.update(req.body, {
    //   where: { id: id },
    // });

    // Update records with a specific condition
    datausers.update(req.body, {
      where: { user_id: id },
    });

    res.send({
      message: "Data was updated successfully.",
    });

    // if (num == 1) {
    //     res.send({
    //         message: "Data was updated successfully."
    //     });
    // } else {
    //     res.send({
    //         message: `Cannot update Data with id=${id}. Maybe DataUser was not found or req.body is empty!`
    //     });
    // }
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


exports.forgot_password = async (req, res) => {

  try {
    const login = req.body.login;

    if (!login || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login)) {
      return res.status(400).send({ status: false, message: "Invalid email address" });
    }

    // Generate a token
    const password = crypto.randomBytes(8).toString("hex");

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h1 style="color: #4CAF50;">Portal Mirandinha - Temporary Password</h1>
      <p>Hello,</p>
      <p>Your temporary password is:</p>
      <blockquote style="border-left: 4px solid #4CAF50; padding-left: 10px; color: #555;">
        ${password}
      </blockquote>
      <p>Please reset your password after logging in.</p>
      <footer style="margin-top: 20px; font-size: 0.9em; color: #777;">
        <p>Best regards,</p>
        <p>Portal Mirandinha Team</p>
      </footer>
    </div>
  `;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Portal Mirandinha" <suporte@portalmirandinha.com.br>',
      to: login,
      subject: "Portal Mirandinha - Reset Password",
      text: htmlContent,
    };

    await transporter.sendMail(mailOptions);


  } catch (error) {
    console.error("Error sending email:", error.message, error.stack);
    res.status(500).send({
      status: false,
      message: "Failed to send email",
    });
  }


};
