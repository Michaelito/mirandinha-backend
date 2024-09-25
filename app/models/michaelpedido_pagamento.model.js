module.exports = (Sequelize, DataTypes) => {
  const michaelpedido_pagamento = Sequelize.define(
    "michael_pedido_pagamento",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      pedido_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
      },
      pagamento_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
      },
      valor: {
        type: DataTypes.DECIMAL(19, 2),
      },
      obs: {
        type: DataTypes.STRING(100),
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    {
      tableName: "michael_pedido_pagamento",
      timestamps: false,
      underscored: true,
    }
  );

  return michaelpedido_pagamento;
};
