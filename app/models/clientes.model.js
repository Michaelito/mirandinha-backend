module.exports = (sequelize, DataTypes) => {
    
    const clientes = sequelize.define('clientes', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        id_exsam: DataTypes.STRING,
        lj: DataTypes.STRING,
        nome: DataTypes.STRING,
        guerra: DataTypes.STRING,
        id_pessoa: DataTypes.STRING,
        id_tipo: DataTypes.STRING,
        id_vended1: DataTypes.STRING,
        id_vended2: DataTypes.STRING,
        id_vended3: DataTypes.STRING,
        id_tabpre: DataTypes.STRING,
        id_pagto: DataTypes.STRING,
        id_fpagto: DataTypes.STRING,
        id_transp: DataTypes.STRING,
        lj_transp: DataTypes.STRING,
        id_frete: DataTypes.STRING,
        cnpj: DataTypes.STRING,
        ie: DataTypes.STRING,
        email: DataTypes.STRING,
        ddd1: DataTypes.STRING,
        fone1: DataTypes.STRING,
        ddd2: DataTypes.STRING,
        fone2: DataTypes.STRING,
        cep: DataTypes.STRING,
        endereco: DataTypes.STRING,
        endnum: DataTypes.STRING,
        endcpl: DataTypes.STRING,
        bairro: DataTypes.STRING,
        id_cidade: DataTypes.STRING,
        cidade: DataTypes.STRING,
        uf: DataTypes.STRING,
        id_pais: DataTypes.STRING
        },
        {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
        }
    );
    return clientes;
};
