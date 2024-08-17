module.exports = (Sequelize, DataTypes) => {

    const michael_customers = Sequelize.define('michael_customeres', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uuid: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      enterprise_id: {
        type: DataTypes.INTEGER(2),
        foreignKey: true,
      },
      name: {
        type: DataTypes.STRING(100)
      },
      birth_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      gender: {
        type: DataTypes.STRING(100)
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
    
    return michael_customers;
  };
  