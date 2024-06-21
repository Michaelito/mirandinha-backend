module.exports = (sequelize, DataTypes) => {
  const pedidos = sequelize.define("michaelpedido_itens", {
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
    produto_id: {
      type: DataTypes.INTEGER,
      forenkey: true,
    },
    produto: {
      type: DataTypes.STRING(255),
    },
    qtde: {
      type: DataTypes.INTEGER,
    },
    valor_unitario: {
      type: DataTypes.DECIMAL(10, 2),
    },
    valor_desconto: {
      type: DataTypes.DECIMAL(10, 2),
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
    },
    obs: {
      type: DataTypes.STRING(255),
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  });

  return pedidos;
};
