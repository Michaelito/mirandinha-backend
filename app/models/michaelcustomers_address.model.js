module.exports = (Sequelize, DataTypes) => {

  const michael_customers_address = Sequelize.define('michael_customers_address', {
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
    customers_id: {
      type: DataTypes.INTEGER(2),
      foreignKey: true,
    },
    delivery_id: {
      type: DataTypes.INTEGER(2),
      foreignKey: true,
    },
    phone: {
      type: DataTypes.STRING(15)
    },
    zip: {
      type: DataTypes.STRING(15)
    },
    street: {
      type: DataTypes.STRING(150)
    },
    number: {
      type: DataTypes.STRING(10)
    },
    complement: {
      type: DataTypes.STRING(50)
    },
    city: {
      type: DataTypes.STRING(50)
    },
    neighborhood: {
      type: DataTypes.STRING(50)
    },
    reference: {
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
  
  return michael_customers_address;
};
