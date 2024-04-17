const db = require("../models");
const Clientes = db.clientes;
const Op = db.Sequelize.Op;


exports.findAll = async (req, res) => {
    const nome = req.query.nome;
    var condition = nome ? {
        nome: {
            [Op.like]: `%${nome}%`
        }
    } : null;
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);

    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber;
    }

    let size = 20;
    if (
      !Number.isNaN(sizeAsNumber) &&
      !(sizeAsNumber > 50) &&
      !(sizeAsNumber < 1)
    ) {
      size = sizeAsNumber;
    }
    const clientWithCount = await Clientes.findAndCountAll({
      where: condition,
      limit: size,
      offset: page * size,
    });
    res.send({
      status: true,
      message: "The request has succeeded",
      limit: size,
      page: page,
      totalPages: Math.ceil(clientWithCount.count / Number.parseInt(size)),
      data: {
        products: clientWithCount.rows,
      },
    });
}

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Clientes.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Data with id=" + id
            });
        });
};
