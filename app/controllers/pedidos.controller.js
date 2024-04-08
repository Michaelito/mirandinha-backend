const db = require("../models");
const pedidos = db.pedidos;
const pedidosItens = db.pedidos_itens;
const { uuid } = require('uuidv4');
const Op = db.Sequelize.Op;


// Create and Save a new Tutorial

// Retrieve all from the database.
exports.findAll = (req, res) => {


    pedidos.hasMany(pedidosItens, {
        foreignKey: 'id_pedido'
    });
    // pedidosItens.belongsTo(pedidos, {
    //     foreignKey: 'id_pedido'
    // });

    pedidos.findAll({
        include: [
            {
                model: pedidosItens,
                required: false,
                attributes: ['id', 'produto', 'preco', 'qtde', 'total', 'peso']
            },
        ]
    })
        .then(data => {
            res.send({
                status: true,
                message: "The request has succeeded",
                data: {
                    Pedidos: data
                }
            }).status(200);
        })
        .catch(err => {
            res.send({
                status: false,
                message: err + "The request has not succeeded",
                data: null
            }).status(500);
        });
};

// // Find a single Tutorial with an id
// exports.findOne = (req, res) => {
//     const id = req.params.id;

//     users.hasMany(datausers, {
//         foreignKey: 'user_id'
//     });

//     users.hasMany(address_users, {
//         foreignKey: 'user_id'
//     });

//     users.findByPk(id, {
//         attributes: { exclude: ['password', 'token', 'refresh_token'] },
//         include: [
//             {
//                 model: datausers,
//                 required: false,
//                 attributes: ['fullname', 'document', 'type', 'rg_ie', 'birthdate', 'createdAt']
//             },
//             {
//                 model: address_users,
//                 required: false,
//                 attributes: ['id', 'cep', 'logradouro', 'numero', 'complemento', 'cidade', 'bairro', 'estado', 'ativo', 'createdAt']
//             }
//         ]
//     })
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Error retrieving Data with id=" + id
//             });
//         });
// };

// Create and Save a new User
exports.create = (req, res) => {
    const payload = {
        id: req.body.id,
        cnpjf: req.body.cnpjf,
        nome: req.body.nome,
        cep: req.body.cep,
        endnum: req.body.endnum,
        endcpl: req.body.endcpl,
        bairro: req.body.bairro,
        id_cidade: req.body.id_cidade,
        cidade: req.body.cidade,
        uf: req.body.uf,
        email: req.body.email,
        ddd1: req.body.ddd1,
        fone1: req.body.fone1,
        dh_mov: req.body.dh_mov,
        id_fpagto: req.body.id_fpagto,
        id_pagto: req.body.id_pagto,
        id_vended1: req.body.id_vended1,
        id_transp: req.body.id_transp,
        id_frete: req.body.id_frete,
        prazo: req.body.prazo,
        peso_bru: req.body.peso_bru,
        peso_liq: req.body.peso_liq,
        total: req.body.total,
        frete: req.body.frete,
        desconto: req.body.desconto,
        total_geral: req.body.total_geral
    };

    // Save Tutorial in the database
    pedidos.create(payload)
        .then(data => {
            res.send(data);
        })

        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating data."
            });
        });
};
// // Update User in database
// exports.update = async (req, res) => {
//     const id = req.params.id;

//     try {

//         await users.update(req.body, {
//             where: { id: id }
//         });

//         // Update records with a specific condition
//         await datausers.update(
//             // Set the values you want to update
//             {
//                 fullname: req.body.data_user.fullname,
//                 birthdate: req.body.data_user.birthdate,
//                 rg_ie: req.body.data_user.rg_ie
//             },
//             // Define the condition for the update operation
//             { where: { user_id: id } }
//         )

//         res.send({
//             message: "Data was updated successfully."
//         });

//         // if (num == 1) {
//         //     res.send({
//         //         message: "Data was updated successfully."
//         //     });
//         // } else {
//         //     res.send({
//         //         message: `Cannot update Data with id=${id}. Maybe DataUser was not found or req.body is empty!`
//         //     });
//         // }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send({
//             message: "Error updating category with id=" + id
//         });
//     }
// };

// exports.delete = async (req, res) => {

//     const id = req.params.id;
//     try {

//         const num = await users.destroy({
//             where: { id: id }
//         })

//         if (num == 1) {
//             res.send({
//                 message: "Data was deleted successfully!"
//             });
//         } else {
//             res.send({
//                 message: `Cannot delete Data with id=${id}. Maybe Data was not found!`
//             });
//         }

//     } catch (err) {
//         return res.status(500).send({
//             message: "Could not delete Data with id=" + id
//         });
//     };
// };
