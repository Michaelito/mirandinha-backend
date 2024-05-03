module.exports = (sequelize, DataTypes) => {

  const produtos = sequelize.define(
    "produtos",
    {
      nsu: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      id: {
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
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      id_grupo1: {
        type: DataTypes.STRING,
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


