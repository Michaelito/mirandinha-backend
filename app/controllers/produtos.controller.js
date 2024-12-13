const { or } = require("sequelize");
const db = require("../models");
const Products = db.produtos;
const grupos = db.grupo_format;
const GradeProdutos = db.produtos_grade;
const sequelize = require("../config/database");
const Op = db.Sequelize.Op;

const { decodeTokenFromHeader } = require('../middleware/auth.js');

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
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const decodedToken = decodeTokenFromHeader(req);

  try {
    // Consulta para contar o total de produtos
    const totalProductsResult = await sequelize.query(
      `SELECT COUNT(DISTINCT id) AS total
       FROM produtos
       WHERE id_subgrupo = ? OR nome LIKE ?`,
      {
        replacements: [search, `%${search}%`],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const totalProducts = totalProductsResult[0].total;

    // Consulta para buscar os produtos
    const products = await sequelize.query(
      `SELECT DISTINCT p.id, p.id_grupo, p.nome, p.descricao, p.preco, p.preco_pf, p.video, p.aplicacao, p.manual_tecnico, p.qrcode, p.unimed, 
       p.comprimento, p.largura, p.altura, p.peso
       FROM produtos p
       JOIN produtos_grades pg ON p.id = pg.id_produto
       WHERE p.id_subgrupo = ? OR p.nome LIKE ? OR pg.id_exsam = ?
       ORDER BY p.id_subgrupo, p.nome ASC
       LIMIT ? OFFSET ?`,
      {
        replacements: [search, `%${search}%`, search, limit, offset],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const id_empresa = decodedToken.id_empresa;

    // Consulta valor por tabpreco
    const tabpreco = await sequelize.query(
      `SELECT tp.fator  
      FROM clientes c 
      JOIN tabpreco tp on tp.id = c.id_tabpre 
      WHERE c.id = ? LIMIT 1`,
      {
        replacements: [id_empresa],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Calculando o preço por tabpreco para cada produto
    const updatedProducts = products.map(product => {
      const calcPrecoTab = parseFloat(product.preco) * parseFloat(tabpreco[0].fator);
      return {
        ...product,
        preco_tab: calcPrecoTab.toFixed(2)
      };
    });

    if (updatedProducts.length === 0) {
      return res.status(404).send({ message: "Produto não encontrado" });
    }

    // Buscar o nome do grupo
    const grupo = await sequelize.query(
      `SELECT name FROM grupo_formats WHERE id = ${updatedProducts[0].id_grupo}`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const nomeGrupo = grupo.length > 0 ? grupo[0].name.toUpperCase() : '';

    // Buscar o nome do subgrupo
    const subgrupo = await sequelize.query(
      `SELECT nome FROM grupos WHERE id = ?`,
      {
        replacements: [search],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const nomeSubGrupo = subgrupo.length > 0 ? subgrupo[0].nome.toUpperCase() : '';

    // Consultas paralelizadas para as grades dos produtos
    const productGradesPromises = updatedProducts.map(async (product) => {
      const productGrade = await sequelize.query(
        "SELECT id, id_exsam, grade, hexadecimal, img FROM produtos_grades WHERE id_produto = ? ORDER BY grade ASC",
        {
          replacements: [product.id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      // Adiciona a propriedade 'produtos_grades' ao produto
      product.produtos_grades = productGrade;
    });

    // Espera todas as promessas de consulta de grades serem resolvidas
    await Promise.all(productGradesPromises);

    // Retornar os dados com a paginação
    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        grupo: nomeGrupo,
        subgrupo: nomeSubGrupo,
        products: updatedProducts,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: totalProducts,
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
