const db = require("../models");
const Cpagto = db.cpagto;

// Find a single Cpagto with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    console.log(req.params);

    Cpagto.findByPk(id)
        .then(data => {
            res.send(data);

        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Cpagto with id=" + ids
            });
        });
};