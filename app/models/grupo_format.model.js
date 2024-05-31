module.exports = (Sequelize, DataTypes) => {

    const grupo_format = Sequelize.define('grupo_format', {
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
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });
    
    return grupo_format;
  };
  