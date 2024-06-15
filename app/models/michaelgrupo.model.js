module.exports = (sequelize, DataTypes) => {
  const MichaelGrupos = sequelize.define("michaelgrupos", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255)
    },
    alias: {
      type: DataTypes.STRING(255)
    },
    order: {
      type: DataTypes.INTEGER(2),
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
  });

  return MichaelGrupos;
};

