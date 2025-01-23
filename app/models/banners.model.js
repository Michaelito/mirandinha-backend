module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define("Banner", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255), // varchar(255)
      allowNull: true, // Permite NULL
    },
    description: {
      type: DataTypes.STRING(255), // varchar(255)
      allowNull: true, // Permite NULL
    },
    url: {
      type: DataTypes.TEXT, // text
      allowNull: true, // Permite NULL
    },
    img: {
      type: DataTypes.TEXT, // text
      allowNull: true, // Permite NULL
    },
    dt_validate: {
      type: DataTypes.DATEONLY, // date
      allowNull: true, // Permite NULL
    },
    status: {
      type: DataTypes.BOOLEAN, // tinyint(1)
      allowNull: false,
      defaultValue: true, // Default é '1'
    },
  }, {
    tableName: "banners", // Nome da tabela no banco de dados
    timestamps: false, // Não inclui createdAt e updatedAt automaticamente
  });

  return Banner;
};
