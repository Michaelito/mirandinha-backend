const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");

const app = express();

var corsOptions = {
    origin: ["http://portalmirandinha.com.br", "http://localhost"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware para configurar os cabeçalhos de controle de cache
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

// Middleware para permitir requisições de métodos e headers específicos
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const { Console } = require('console');

db.sequelize.sync();

// Load Routes
require("./app/routes/api/v1/tutorial.routes")(app);
require("./app/routes/api/v1/user.routes")(app);
require("./app/routes/api/v1/address_users.routes")(app);
require("./app/routes/api/v1/dataUser.routes")(app);
require("./app/routes/api/v1/auth.routes")(app);
require("./app/routes/api/v1/produtos.routes")(app);
require("./app/routes/api/v1/grupo.routes")(app);
require("./app/routes/api/v1/fpagto.routes")(app);
require("./app/routes/api/v1/cpagto.routes")(app);
require("./app/routes/api/v1/clientes.routes")(app);
require("./app/routes/api/v1/pedidos.routes")(app);
require("./app/routes/api/v1/pedidos_itens.routes")(app);
require("./app/routes/api/v1/estoque.routes")(app);
require("./app/routes/api/v1/grupo_format.routes")(app);
require("./app/routes/api/v1/exsam.routes")(app);
require("./app/routes/api/v1/cores.routes")(app);
require("./app/routes/api/v1/produtos_grade.routes")(app);
require("./app/routes/api/v1/dashboard.routes")(app);
require("./app/routes/api/v1/subgrupo.routes")(app);
require("./app/routes/api/v1/newsletter.routes")(app);
require("./app/routes/api/v1/michaelgrupo.routes")(app);
require("./app/routes/api/v1/michaelproduto.routes")(app);
require("./app/routes/api/v1/michaelpedido.routes")(app);
require("./app/routes/api/v1/michaelcustomers.routes")(app);
require("./app/routes/api/v1/michaelcustomers_address.routes")(app);
require("./app/routes/api/v1/motoboy.routes")(app);
require("./app/routes/api/v1/payment.routes")(app);
require("./app/routes/api/v1/deliveryArea.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// simple route index || status
app.get(["/", "/status"], (req, res) => {
    res.status(200).send({
        title: 'Welcome to API',
        version: '1.0.0',
    });
});
