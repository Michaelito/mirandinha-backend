module.exports = (sequelize, DataTypes) => {
  const Tutorial = sequelize.define("michaelprodutos", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    group_id: {
      type: DataTypes.INTEGER,
      forenkey: true
    },
    name: {
      type: DataTypes.STRING(255)
    },
    descricao: {
      type: DataTypes.STRING(255)
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2)
    },
    valor_promocao: {
      type: DataTypes.DECIMAL(10, 2)
    },
    img: {
      type: DataTypes.TEXT()
    },
    order: {
      type: DataTypes.INTEGER(2)
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
  });

  return Tutorial;
};

