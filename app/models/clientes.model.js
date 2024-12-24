module.exports = (sequelize, DataTypes) => {

    const clientes = sequelize.define('clientes', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_exsam: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lj: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        razao_social: {
            type: DataTypes.STRING(255),
            allowNull: true,
            charset: 'latin1',
            collate: 'latin1_swedish_ci'
        },
        nome_fantasia: {
            type: DataTypes.STRING(255),
            allowNull: true,
            charset: 'latin1',
            collate: 'latin1_swedish_ci'
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(255),
            allowNull: true,
            charset: 'latin1',
            collate: 'latin1_swedish_ci'
        },
        cnpj: {
            type: DataTypes.STRING(255),
            allowNull: true,
            charset: 'latin1',
            collate: 'latin1_swedish_ci'
        },
        ie: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        endereco: {
            type: DataTypes.STRING(255),
            allowNull: true,
            charset: 'latin1',
            collate: 'latin1_swedish_ci'
        },
        numero: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        complemento: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        cidade: {
            type: DataTypes.STRING(255),
            allowNull: true,
            charset: 'latin1',
            collate: 'latin1_swedish_ci'
        },
        uf: {
            type: DataTypes.STRING(255),
            allowNull: true,
            charset: 'latin1',
            collate: 'latin1_swedish_ci'
        },
        id_tabpre: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_forma_pagamento: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_pagamento: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_trasnportador: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_vendedor: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_pessoa: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '1: Ativo\n2: Inativo\n3: Novo',
        },
    }, {
        tableName: 'clientes',
        timestamps: false,
    });
    return clientes;
};
