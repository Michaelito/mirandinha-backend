module.exports = (sequelize, Sequelize) => {
  const Newsletter = sequelize.define("newsletter", {
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
    title: {
      type: Sequelize.STRING(255),
    },
    description: {
      type: Sequelize.TEXT,
    },
    img: {
      type: Sequelize.TEXT,
    },
    video: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: 1,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    }
  });

  return Newsletter;
};
