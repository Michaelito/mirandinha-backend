module.exports = (sequelize, DataTypes) => {

  const pedidos = sequelize.define("pedidos", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      foreignKey: true,
    },
    id_empresa: {
      type: DataTypes.INTEGER,
      foreignKey: true,
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
      foreignKey: true,
    },
    id_pagto: {
      type: DataTypes.INTEGER,
      foreignKey: true,
    },
    id_vended1: {
      type: DataTypes.INTEGER,
      foreignKey: true,
    },
    id_transp: {
      type: DataTypes.INTEGER,
      foreignKey: true,
    },
    id_frete: {
      type: DataTypes.INTEGER,
      foreignKey: true,
    },
    pedido_id_exsam: {
      type: DataTypes.INTEGER,
    },
    obs: {
      type: DataTypes.STRING,
    },
    prazo: { type: DataTypes.INTEGER },
    peso_bru: { type: DataTypes.DECIMAL(10, 4) },
    peso_liq: { type: DataTypes.DECIMAL(10, 4) },
    total: { type: DataTypes.DECIMAL(10, 4) },
    frete: { type: DataTypes.DECIMAL(10, 4) },
    desconto: { type: DataTypes.DECIMAL(10, 4) },
    total_geral: { type: DataTypes.DECIMAL(10, 4) },
    status: {
      type: DataTypes.STRING(2),
      comment: '0:Inativo, 1:Registrado/Ativo, 2:Em Análise, 3:Fechando, 4:Aprovado, 5:Reprovado, 6:Retido',
    },

  });

  return pedidos;
};