module.exports = (sequelize, Sequelize) => {
  const users = sequelize.define('users', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: Sequelize.STRING(36),
      allowNull: false,
    },
    id_empresa: {
      type: Sequelize.INTEGER
    },
    login: {
      type: Sequelize.STRING(255),
    },
    fullname: {
      type: Sequelize.STRING(255),
    },
    document: {
      type: Sequelize.INTEGER
    },
    ddi: {
      type: Sequelize.STRING(3),
    },
    ddd: {
      type: Sequelize.INTEGER
    },
    phone: {
      type: Sequelize.INTEGER
    },
    password: {
      type: Sequelize.STRING(50),
    },
    token: {
      type: Sequelize.STRING(150),
    },
    refresh_token: {
      type: Sequelize.STRING(150),
    },
    profile: {
      type: Sequelize.STRING(50),
      comment: 'Admin: 1, B2B: 2, B2C: 3, Representante: 4',
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: 1,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    deletedAt: {
      type: Sequelize.DATE,
    }
  });


  return users;
};
