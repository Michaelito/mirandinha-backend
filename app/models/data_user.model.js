module.exports = (sequelize, Sequelize) => {
    const data_users = sequelize.define('data_users', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: Sequelize.INTEGER,
            foreignKey: true
        },
        uuid: {
            type: Sequelize.STRING(36),
            allowNull: false,
        },
        fullname: {
            type: Sequelize.STRING(50),
        },
        type: {
            type: Sequelize.INTEGER(1),
        },
        document: {
            type: Sequelize.STRING(50),
        },
        rg_ie: {
            type: Sequelize.STRING(50),
        },
        phone: {
            type: Sequelize.STRING(20),
        },
        cellphone: {
            type: Sequelize.STRING(20),
        },
        birthdate: {
            type: Sequelize.DATEONLY,
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
        },

    });

    return data_users;
};
