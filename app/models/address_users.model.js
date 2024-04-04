module.exports = (Sequelize, DataTypes) => {

  const address_users = Sequelize.define('address_users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      forenkey: true
    },
    cep: {
      type: DataTypes.STRING(10)
    },
    logradouro: {
      type: DataTypes.STRING(150),
      defaultValue: null
    },
    numero: {
      type: DataTypes.STRING(10),
      defaultValue: null
    },
    complemento: {
      type: DataTypes.STRING(100)
    },
    cidade: {
      type: DataTypes.STRING(50),
      defaultValue: null
    },
    bairro: {
      type: DataTypes.STRING(100),
      defaultValue: null
    },
    estado: {
      type: DataTypes.STRING(50),
      defaultValue: null
    },
    pais: {
      type: DataTypes.STRING(10),
      defaultValue: null
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
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


  return address_users;
};
