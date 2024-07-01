module.exports = (Sequelize, DataTypes) => {

    const produtos_grade = Sequelize.define('produtos_grade', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uuid: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      produto_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
      },
      cores_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
      },
      quantidade: {
        type: DataTypes.INTEGER,
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

   
    return produtos_grade;
  };
  