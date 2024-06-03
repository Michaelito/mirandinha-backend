const db = require("../models");
const Products = db.produtos;
const Estoque = db.estoque;
const grupos = db.grupo;
const Op = db.Sequelize.Op;

exports.findAll = async (req, res) => {
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

  const productWithCount = await Products.findAndCountAll({
    limit: size,
    offset: page * size,
  });

  res.send({
    status: true,
    message: "The request has succeeded",
    limit: size,
    page: page,
    totalPages: Math.ceil(productWithCount.count / Number.parseInt(size)),
    data: {
      products: productWithCount.rows,
    },
  });
};

exports.findAllGroup = async (req, res) => {

    const id = req.params.id;

    Products.findAll({ where: {grupo_format: id} })
    .then((data) => {
      res
        .send({
          status: true,
          message: "The request has succeeded",
          data: {
            products: data,
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

// exports.findAllGroup = async (req, res) => {
//   const id = req.params.id;
//   const pageAsNumber = Number.parseInt(req.query.page);
//   const sizeAsNumber = Number.parseInt(req.query.size);

//   let page = 0;
//   if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
//     page = pageAsNumber;
//   }

//   let size = 20;

//   if (
//     !Number.isNaN(sizeAsNumber) &&
//     !(sizeAsNumber > 50) &&
//     !(sizeAsNumber < 1)
//   ) {
//     size = sizeAsNumber;
//   }

//   const grupo = await grupos.findOne({
//     where: { id: id },
//   });

//   await Products.findAndCountAll({
//     where: { grupo_format: id },
//     limit: size,
//     offset: page * size,
//   })
//     .then((productWithCount) => {
//       if (productWithCount.count >= 1) {
//         res.send({
//           status: true,
//           message: "The request has succeeded",
//           limit: size,
//           page: page,
//           totalPages: Math.ceil(productWithCount.count / Number.parseInt(size)),
//           grupo: grupo.nome,
//           data: {
//             products: productWithCount.rows,
//           },
//         });
//       } else {
//         res.send({
//           status: true,
//           message: `Cannot localizar Data with id=${id}. Maybe Data was not found or empty!`,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Error Data with id=" + id,
//       });
//     });
// };

// Find a single Data with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Products.hasOne(Estoque, {
    foreignKey: "id",
  });

  Products.findByPk(id, {
    include: [
      {
        model: Estoque,
        required: false,
        attributes: ["fil", "estoque", "empenho", "disponivel"],
      },
    ],
  })
    .then((data) => {
      res.send({
        status: true,
        message: "The request has succeeded",
        data: {
          product: data,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "Error retrieving Data with id=" + id,
      });
    });
};

// Update a Data by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Products.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Data was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Data with id=${id}. Maybe Data was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Data with id=" + id,
      });
    });
};
