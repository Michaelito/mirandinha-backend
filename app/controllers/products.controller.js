const db = require("../models");
const Products = db.product;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
    const { page = 1, pageSize = 10 } = req.params; // Default page = 1, pageSize = 10

    // Calculate offset based on page number and page size
    const offset = (page - 1) * pageSize;

    Products.findAll({
       
        limit: pageSize,
        offset: offset
    })
    .then(data => {
        const { count, rows } = data;

        // Calculate total pages based on total count and page size
        const totalPages = Math.ceil(count / pageSize);

        res.status(200).json({
            status: true,
            message: "Request succeeded",
            data: {
                products: data,
                currentPage: parseInt(page),
                pageSize: parseInt(pageSize),
                totalCount: count,
                totalPages: totalPages
            }
        });
    })
    .catch(err => {
        console.error("Error retrieving products:", err);
        res.status(500).json({
            status: false,
            message: "Request failed",
            error: err.message || "An error occurred while retrieving products"
        });
    });
};

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

