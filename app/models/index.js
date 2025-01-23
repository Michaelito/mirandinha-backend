const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false,


  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.address_users = require("./address_users.model.js")(sequelize, Sequelize);
db.data_users = require("./data_user.model.js")(sequelize, Sequelize);
db.grupo = require("./grupo.model.js")(sequelize, Sequelize);
db.grupo_format = require("./grupo_format.model.js")(sequelize, Sequelize);
db.estoque = require("./estoque.model.js")(sequelize, Sequelize);
db.fpagto = require("./fpagto.model.js")(sequelize, Sequelize);
db.cpagto = require("./cpagto.model.js")(sequelize, Sequelize);
db.produtos = require("./produtos.model")(sequelize, Sequelize);
db.clientes = require("./clientes.model")(sequelize, Sequelize);
db.pedidos = require("./pedidos.model.js")(sequelize, Sequelize);
db.pedidos_itens = require("./pedidos_itens.model.js")(sequelize, Sequelize);
db.cores = require("./cores.model.js")(sequelize, Sequelize);
db.produtos_grade = require("./produtos_grade.model.js")(sequelize, Sequelize);
db.subgrupo = require("./subgrupo.model.js")(sequelize, Sequelize);
db.newsletter = require("./newsletter.model.js")(sequelize, Sequelize);
db.banners = require("./banners.model.js")(sequelize, Sequelize);

db.michaelgrupos = require("./michaelgrupo.model.js")(sequelize, Sequelize);
db.michaelprodutos = require("./michaelproduto.model.js")(sequelize, Sequelize);
db.michaelpedidos = require("./michaelpedidos.model.js")(sequelize, Sequelize);
db.michaelpedido_itens = require("./michaelpedido_itens.model.js")(
  sequelize,
  Sequelize
);
db.michaelcustomers = require("./michaelcustomers.model.js")(
  sequelize,
  Sequelize
);
db.michael_customers_address = require("./michaelcustomers_address.model.js")(
  sequelize,
  Sequelize
);
db.deliveryValue = require("./michaeldeliveryvalue.model.js")(sequelize, Sequelize);
db.motoboy = require("./motoboy.model.js")(sequelize, Sequelize);
db.payment = require("./payment.model.js")(sequelize, Sequelize);
db.deliveryArea = require("./deliveryArea.model.js")(sequelize, Sequelize);
db.michaelpedido_pagamento = require("./michaelpedido_pagamento.model.js")(sequelize, Sequelize);

module.exports = db;

