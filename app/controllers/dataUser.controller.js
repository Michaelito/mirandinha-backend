const { where } = require("sequelize");
const db = require("../models");
const DataUser = db.dataUsers;
const Op = db.Sequelize.Op;
const { uuid } = require('uuidv4');
const user = require("../models/user.model");




exports.findAll = async (req, res) => {

    try {
        const data = await DataUser.findAll({ includes: { model: user, as: 'dataUsers' } })

        return res.send({
            status: true,
            message: "The request has succeeded",
            data: {
                dataUsers: data
            }
        }).status(200);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ message: 'Ocorreu um erro' });

    }
};
// Create and Save a new DataUser
exports.create = (req, res) => {
    // Validate request
    if (!req.body.fullName) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a DataUser
    const dataUser = {
        uuid: uuid(),
        fullName: req.body.fullName,
        cpf: req.body.cpf,
        rg: req.body.rg,
        birthDate: req.body.birthDate,
        user_id: req.body.user_id,
    }

    // Save DataUser in the database
    DataUser.create(dataUser)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the DataUser."
            });
        });
};