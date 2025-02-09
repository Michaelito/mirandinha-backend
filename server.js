const express = require("express");
const cors = require("cors");
const db = require("./app/models");

const app = express();


// Lista de origens permitidas
const allowedOrigins = [
    'http://portalmirandinha.com.br',
    'http://www.portalmirandinha.com.br',
    'http://localhost'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET, PUT, POST, DELETE", // Adicione aqui todos os métodos necessários
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync();

// Load Routes
require("./app/routes/api/v1/tutorial.routes")(app);
require("./app/routes/api/v1/user.routes")(app);
require("./app/routes/api/v1/address_users.routes")(app);
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
require("./app/routes/api/v1/transportadoras.routes")(app);
require("./app/routes/api/v1/banners.routes")(app);
require("./app/routes/api/v1/admin/dashboard.routes")(app);


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
