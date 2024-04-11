module.exports = (sequelize, DataTypes) => {

    const estoque = sequelize.define('estoque', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        fil: {
            type: DataTypes.STRING,
            allowNull: true
        },
        estoque: {
            type: DataTypes.STRING,
            allowNull: true
        },
        empenho: {
            type: DataTypes.STRING,
            allowNull: true
        },
        disponivel: {
            type: DataTypes.STRING,
            allowNull: true
        },
    },
        {
            // Other model options go here
            timestamps: false,

            createdAt: false,

            updatedAt: false,

            freezeTableName: true

        });

    return estoque;
};


