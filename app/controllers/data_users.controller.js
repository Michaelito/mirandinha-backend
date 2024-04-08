const { where } = require("sequelize");
const db = require("../models");
const datausers = db.data_users;
const Op = db.Sequelize.Op;
const { uuid } = require('uuidv4');
const user = require("../models/user.model");




exports.findAll = async (req, res) => {

    try {
        const data = await datausers.findAll()

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

exports.findOne = (req, res) => {
    const id = req.params.id;

    datausers.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving data with id=" + id
            });
        });
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
    datausers.create(dataUser)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the DataUser."
            });
        });
};
// Update DataUser in database
exports.update = async (req, res) => {
    const id = req.params.id;

    try {

        const num = await datausers.update(req.body, {
            where: { id: id }
        });


        if (num == 1) {
            res.send({
                message: "Data was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Data with id=${id}. Maybe DataUser was not found or req.body is empty!`
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Error updating category with id=" + id
        });
    }
};

// Delete a Data with the specified id in the request
exports.delete = async (req, res) => {

    const id = req.params.id;
    try {

        const num = await datausers.destroy({
            where: { id: id }
        })

        if (num == 1) {
            res.send({
                message: "Data was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Data with id=${id}. Maybe Data was not found!`
            });
        }

    } catch (err) {
        return res.status(500).send({
            message: "Could not delete Data with id=" + id
        });
    };
};