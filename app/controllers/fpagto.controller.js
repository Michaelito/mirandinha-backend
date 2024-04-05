const db = require("../models");
const Fpagto = db.fpagto;

// Find a single Fpagto with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    console.log(req.params);

    Fpagto.findByPk(id)
        .then(data => {
            res.send(data);

        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Fpagto with id=" + ids
            });
        });
};