module.exports = (sequelize, Sequelize) => {
    const grupo = sequelize.define('grupos', {
        nsu: {
            type: Sequelize.STRING(1024),
            allowNull: true,
        },
        niv: {
            type: Sequelize.STRING(1024),
            allowNull: true,
        },
        nome: {
            type: Sequelize.STRING(1024),
            allowNull: true,
        }
    },
        {
            // Other model options go here
            timestamps: false,

            createdAt: false,

            updatedAt: false,

        });
    return grupo;
};
