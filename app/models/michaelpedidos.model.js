module.exports = (sequelize, DataTypes) => {
  const pedidos = sequelize.define("michaelpedidos", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    cliente: {
      type: DataTypes.STRING(50),
    },
    celular: {
      type: DataTypes.STRING(20),
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
    valor_unit: {
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
