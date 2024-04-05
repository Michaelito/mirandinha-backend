module.exports = (sequelize, Sequelize) => {
    const cpagto = sequelize.define('cpagto', {
        nsu: {
            type: Sequelize.STRING(1024),
            allowNull: true,
        },
        nome: {
            type: Sequelize.STRING(1024),
            allowNull: true,
        },
    },
        {

            timestamps: false,

            createdAt: false,

            updatedAt: false,

            freezeTableName: true

        },
    );
    return cpagto;
};
