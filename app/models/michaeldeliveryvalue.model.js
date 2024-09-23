module.exports = (sequelize, DataTypes) => {
  const FreteDelivery = sequelize.define(
    "FreteDelivery",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      id_empresa: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      data_cad: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      valor_inicio: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
      },
      valor_fim: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
      },
      tipo_taxa: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      valor_taxa: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "frete_delivery",
      timestamps: false,
      underscored: true,
    }
  );

  return FreteDelivery;
};
