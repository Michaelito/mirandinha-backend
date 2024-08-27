
module.exports = (sequelize, DataTypes) => {

  const produtos = sequelize.define(
    "produtos",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_exsam: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      aplicacao: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      video: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      manual_tecnico: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      qrcode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      grupo_format: {
        type: DataTypes.STRING,
        allowNull: true,
        forenkey: true,
      },
      id_grupo1: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_grupo2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      id_grupo3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      id_clafis: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      id_unimed: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      unimed: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      preco_pf: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      preco: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      qtde_emb: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      peso_bru: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      peso_liq: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      comp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      larg: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      altu: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      modulo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      // Other model options go here
      timestamps: false,

      createdAt: false,

      updatedAt: false,
    }
  );


  return produtos;
};


