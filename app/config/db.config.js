module.exports = {
    HOST: "grupomirandinha.doxotech.com.br",
    PORT: 3306,
    USER: "mirandinha",
    PASSWORD: "YFBHSqKRmV6E",
    DB: "mirandinhadb",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
