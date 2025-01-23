const db = require("../models");
const Banners = db.banners;

exports.findAll = (req, res) => {

  Banners.findAll()
    .then(data => {
      res.send({
        status: true,
        message: "The request has succeeded",
        data: {
          Banners: data
        }
      }).status(200);
    })
    .catch(err => {
      res.send({
        status: false,
        message: "The request has not succeeded",
        data: null
      }).status(500);
    });
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
      dt_validate,
      status: status ?? true, // Se `status` for undefined, define como `true`
    });

    // Resposta de sucesso
    res.status(201).send({
      status: true,
      message: "Banner criado com sucesso.",
      data: newBanner,
    });
  } catch (error) {
    // Captura e retorna erros
    res.status(500).send({
      status: false,
      message: "Erro ao criar o banner.",
      error: error.message,
    });
  }
};
