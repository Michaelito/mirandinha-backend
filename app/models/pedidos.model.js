module.exports = (sequelize, DataTypes) => {

  const pedidos = sequelize.define('pedidos', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    cnpjf: { type: DataTypes.STRING },
    nome: { type: DataTypes.STRING },
    cep: { type: DataTypes.STRING },
    endereco: { type: DataTypes.STRING },
    endnum: { type: DataTypes.STRING },
    endcpl: { type: DataTypes.STRING },
    bairro: { type: DataTypes.STRING },
    id_cidade: { type: DataTypes.INTEGER },
    cidade: { type: DataTypes.STRING },
    uf: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    ddd1: { type: DataTypes.STRING },
    fone1: { type: DataTypes.STRING },
    dh_mov: { type: DataTypes.DATE },
    id_fpagto: {
      type: DataTypes.INTEGER,
      foreignKey: true
    },
    id_pagto: {
      type: DataTypes.INTEGER,
      foreignKey: true
    },
    id_vended1: {
      type: DataTypes.INTEGER,
      foreignKey: true
    },
    id_transp: {
      type: DataTypes.INTEGER,
      foreignKey: true
    },
    id_frete: {
      type: DataTypes.INTEGER,
      foreignKey: true
    },
    prazo: { type: DataTypes.INTEGER },
    peso_bru: { type: DataTypes.DECIMAL(10, 4) },
    peso_liq: { type: DataTypes.DECIMAL(10, 4) },
    total: { type: DataTypes.DECIMAL(10, 4) },
    frete: { type: DataTypes.DECIMAL(10, 4) },
    desconto: { type: DataTypes.DECIMAL(10, 4) },
    total_geral: { type: DataTypes.DECIMAL(10, 4) }
  });

  return pedidos;
};