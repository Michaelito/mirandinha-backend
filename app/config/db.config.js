module.exports = {

  //HOST: "grupomirandinha.doxotech.com.br",
  HOST: "localhost",
  //USER: "mirandinhadb",
  USER: "root",
  //PASSWORD: "YFBHSqKRmV6E",
  PASSWORD: "",
  DB: "mirandinhadb",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};


