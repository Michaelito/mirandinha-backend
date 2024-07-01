module.exports = (Sequelize, DataTypes) => {

    const cores = Sequelize.define('cores', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uuid: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      cor: {
        type: DataTypes.STRING(255)
      },
      exadecimal: {
        type: DataTypes.STRING(50)
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
    
    return cores;
  };
  