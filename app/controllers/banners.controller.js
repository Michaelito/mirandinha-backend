const db = require("../models");
const Banners = db.banners;

exports.findAll = async (req, res) => {
  try {
    // Busca todos os banners com status = 1
    const banners = await Banners.findAll({ where: { status: 1 } });

    res.status(200).send({
      status: true,
      message: "The request has succeeded",
      data: {
        banners: banners, // Dados retornados
      },
    });
  } catch (err) {
    // Tratamento de erros
    console.error("Erro ao buscar banners:", err);

    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
    });
  }
};


exports.create = async (req, res) => {
  try {
    // Obter os dados do corpo da requisição
    const { title, description, url, img, dt_validate, status } = req.body;

    // Validar os dados (opcional, adicione mais validações se necessário)
    if (!title || !img) {
      return res.status(400).send({
        status: false,
        message: "Os campos 'title' e 'img' são obrigatórios.",
      });
    }

    // Criar um novo banner no banco de dados
    const newBanner = await Banners.create({
      title,
      description,
      url,
      img,
      dt_validate: dt_validate ?? Null,
      status: status ?? true, // Se `status` for undefined, define como `true`
    });

    // Resposta de sucesso
    res.status(201).send({
      status: true,
      message: "The request has succeeded",
      data: newBanner,
    });
  } catch (error) {
    // Captura e retorna erros
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    // Atualiza o registro com base no ID
    const [updatedRows] = await Banners.update(req.body, {
      where: { id: id },
    });

    if (updatedRows === 0) {
      // Verifica se nenhum registro foi atualizado
      return res.status(404).send({
        status: false,
        message: "Data not found",
      });
    }

    res.send({
      status: true,
      message: "The request has succeeded",
    });
  } catch (err) {
    // Trata erros inesperados
    console.error("Erro ao atualizar registro:", err);
    res.status(500).send({
      status: false,
      message: "The request has not succeeded",
    });
  }
};

