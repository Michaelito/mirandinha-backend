module.exports = (Sequelize, DataTypes) => {
  const subgrupo = Sequelize.define("subgrupo", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    grupo_id: {
      type: DataTypes.INTEGER,
      forenkey: true,
    },
    name: {
      type: DataTypes.STRING(255),
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  });

  return subgrupo;
};
