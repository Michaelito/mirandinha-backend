const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.address_users = require("./address_users.model.js")(sequelize, Sequelize);
db.data_users = require("./data_user.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.grupo = require("./grupo.model.js")(sequelize, Sequelize);
db.fpagto = require("./fpagto.model.js")(sequelize, Sequelize);
db.cpagto = require("./cpagto.model.js")(sequelize, Sequelize);
db.product = require("./product.model")(sequelize, Sequelize);
db.clientes = require("./clientes.model")(sequelize, Sequelize);
db.pedidos = require("./pedidos.model.js")(sequelize, Sequelize);
db.pedidos_itens = require("./pedidos_itens.model.js")(sequelize, Sequelize);

module.exports = db;