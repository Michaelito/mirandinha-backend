module.exports = (sequelize, DataTypes) => {
  const DeliveryArea = sequelize.define(
    "delivery_area",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_empresa: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cep: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numero_inicio: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      numero_fim: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tipo_logradouro: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logradouro: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bairro: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cidade: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uf: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_frete_delivery: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      adicional_frete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: "delivery_area",
      timestamps: false,
      underscored: true,
    }
  );

  return DeliveryArea;
};
