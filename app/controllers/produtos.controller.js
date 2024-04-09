const db = require("../models");
const Products = db.produtos;
const Op = db.Sequelize.Op;
exports.findAll = async (req, res) => {
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);

    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber;
    }

    let size = 10;
    if (!Number.isNaN(sizeAsNumber) && !(sizeAsNumber > 50) && !(sizeAsNumber < 1)) {
        size = sizeAsNumber;
    }
    const productWithCount = await Products.findAndCountAll({
        limit: size,
        offset: page * size
    });
    res.send({
        content: productWithCount.rows,
        limit: size,
        page: page,
        totalPages: Math.ceil(productWithCount.count / Number.parseInt(size))

    });
}

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Products.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Data with id=" + id
            });
        });
};

