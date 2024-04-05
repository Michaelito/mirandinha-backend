module.exports = (sequelize, Sequelize) => {
    const fpagto = sequelize.define('fpagto', {
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
    return fpagto;
};
