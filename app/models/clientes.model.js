module.exports = (sequelize, DataTypes) => {

    const clientes = sequelize.define('clientes', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_exsam: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        id_tabpre: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        lj: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        razao_social: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        nome_fantasia: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        cnpj: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        endereco: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        numero: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        complemento: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        cidade: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        uf: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        ie: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'clientes',
        timestamps: false,
    });
    return clientes;
};
