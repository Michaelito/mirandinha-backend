module.exports = (Sequelize, DataTypes) => {
  const produtos_grade = Sequelize.define(
    "produtos_grade",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_exsam: {
        type: DataTypes.INTEGER,
      },
      id_produto: {
        type: DataTypes.INTEGER,
        foreignKey: true,
      },
      grade: {
        type: DataTypes.STRING(50),
      },
      hexadecimal: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      img: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      quantidade: {
        type: DataTypes.INTEGER,
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
    },
    {
      // Other model options go here
      timestamps: false,

      createdAt: false,

      updatedAt: false,
    }
  );

  return produtos_grade;
};
