const { or } = require("sequelize");
const db = require("../models");
const Products = db.produtos;
const grupos = db.grupo_format;
const grupo_geral = db.grupo;
const GradeProdutos = db.produtos_grade;
const sequelize = require("../config/database");
const Op = db.Sequelize.Op;

exports.findAll = async (req, res) => {

  const nome = req.query.nome;

  var condition = {};

  if (nome) {
    condition = {
      [Op.or]: [
        { nome: { [Op.like]: `%${nome}%` } },
        { id_exsam: { [Op.like]: `%${nome}%` } }, // buscando também na coluna 'codigo' com o mesmo parâmetro 'nome'
      ],
    };
  }

  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  Products.hasMany(GradeProdutos, {
    foreignKey: "produto_id",
  });

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

  const productWithCount = await Products.findAndCountAll(
    { where: condition },
    {
      include: [
        {
          model: GradeProdutos,
          required: false,
          attributes: [
            "id",
            "cor_id",
            "cor",
            "hexadecimal",
            "img",
            "quantidade",
          ],
        },
      ],
      limit: size,
      offset: page * size,
    }
  );

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
  console.log("products all group/id");

  const id = req.params.id;
  const nome = req.query.nome;

  var condition = { id_grupo1: id };

  if (nome) {
    condition = {
      [Op.or]: [
        { nome: { [Op.like]: `%${nome}%` } },
        { id_exsam: { [Op.like]: `%${nome}%` } }, // buscando também na coluna 'codigo' com o mesmo parâmetro 'nome'
      ],
    };
  }

  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  Products.hasMany(GradeProdutos, {
    foreignKey: "produto_id",
  });

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

  const grupo = await grupos.findOne({
    where: { id: id },
  });

  await Products.findAndCountAll(
    //{ where: condition },
    {
      include: [
        {
          model: GradeProdutos,
          required: false,
          attributes: [
            "id",
            "cor_id",
            "cor",
            "hexadecimal",
            "img",
            "quantidade",
          ],
        },
      ],
      where: { grupo_format: id },
      order: [["id", "ASC"]],
      limit: size,
      offset: page * size,
    }
  )
    .then((productWithCount) => {
      if (productWithCount.count >= 1) {
        res.send({
          status: true,
          message: "The request has succeeded",
          limit: size,
          page: page,
          totalPages: Math.ceil(productWithCount.count / Number.parseInt(size)),
          grupo: grupo.name,
          subgrupo: grupo.name,
          data: {
            products: productWithCount.rows,
          },
        });
      } else {
        res.send({
          status: true,
          message: `Cannot localizar Data with id=${id}. Maybe Data was not found or empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error Data with id=" + id,
      });
    });
};

exports.findAllSubGroup = async (req, res) => {
  const { search } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const products = await sequelize.query(
      `SELECT DISTINCT id, id_grupo, nome, descricao, preco, video, aplicacao, manual_tecnico, qrcode
       FROM produtos
       WHERE id_subgrupo = ? OR nome LIKE ?
       ORDER BY id_subgrupo, nome ASC
       LIMIT ? OFFSET ?`,
      {
        replacements: [search, `%${search}%`, limit, offset],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (products.length === 0) {
      return res.status(404).send({ message: "Produto não encontrado" });
    }

    const grupo = await sequelize.query(
      `SELECT name FROM grupo_formats WHERE id = ${products[0].id_grupo}`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const nomeGrupo = grupo.length > 0 ? grupo[0].name.toUpperCase() : 'Grupo não encontrado';

    const subgrupo = await sequelize.query(
      `SELECT nome FROM grupos WHERE id = ?`,
      {
        replacements: [search],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const nomeSubGrupo = subgrupo.length > 0 ? subgrupo[0].nome.toUpperCase() : 'Sub Grupo não encontrado';

    for (const product of products) {
      const productGrade = await sequelize.query(
        "SELECT id_exsam, grade, hexadecimal, img FROM produtos_grades WHERE id_produto = ? ORDER BY grade ASC",
        {
          replacements: [product.id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      product.produtos_grades = productGrade;
    }

    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        grupo: nomeGrupo,
        subgrupo: nomeSubGrupo,
        products: products,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: products.length,
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
    });
  }
};


// exports.findAllSubGroup = async (req, res) => {
//   console.log("products all subgroup/id");

//   const id = req.params.id;
//   const nome = req.query.nome;

//   var condition = { id_subgrupo: id };

//   if (nome) {
//     condition = {
//       [Op.or]: [
//         { nome: { [Op.like]: `%${nome}%` } },
//         { id_exsam: { [Op.like]: `%${nome}%` } }, // buscando também na coluna 'codigo' com o mesmo parâmetro 'nome'
//       ],
//     };
//   }

//   const pageAsNumber = Number.parseInt(req.query.page);
//   const sizeAsNumber = Number.parseInt(req.query.size);

//   Products.hasMany(GradeProdutos, {
//     foreignKey: "id_produto",
//   });

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

//   // const produtosresult = await Products.findOne({
//   //   where: { id_subgrupo: id },
//   // });

//   // const grupo_nome = await grupos.findOne({
//   //   where: { id: produtosresult.id_grupo },
//   // });

//   // const subgrupo_nome = await grupo_geral.findOne({
//   //   where: { id: produtosresult.id_subgrupo },
//   // });

//   await Products.findAndCountAll(
//     //{ where: condition },
//     {
//       include: [
//         {
//           model: GradeProdutos,
//           required: false,
//           attributes: [
//             "id",
//             "id_exsam",
//             "grade",
//             "hexadecimal",
//             "img",
//             "quantidade",
//           ],
//         },
//       ],
//       where: condition,
//       order: [["id", "ASC"]],
//       limit: size,
//       offset: page * size,
//     }
//   )
//     .then((productWithCount) => {
//       if (productWithCount.count >= 1) {
//         res.send({
//           status: true,
//           message: "The request has succeeded",
//           limit: size,
//           page: page,
//           totalPages: Math.ceil(productWithCount.count / Number.parseInt(size)),
//           // grupo: grupo_nome.name,
//           // subgrupo: subgrupo_nome.nome,
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

  Products.hasMany(GradeProdutos, {
    foreignKey: "id_produto",
  });

  Products.findByPk(id, {
    include: [
      {
        model: GradeProdutos,
        required: false,
        attributes: ["id", "id_exsam", "grade", "hexadecimal", "img", "quantidade"],
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

  Products.upsert(req.body, {
    where: { produto_id: id },
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
