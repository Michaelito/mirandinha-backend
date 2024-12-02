
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
      id_grupo: {
        type: DataTypes.STRING,
        allowNull: true,
        forenkey: true,
      },
      id_subgrupo: {
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
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      preco: {
        type: DataTypes.DECIMAL(19, 4),
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


