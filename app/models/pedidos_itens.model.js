module.exports = (sequelize, DataTypes) => {
    const pedidosItens = sequelize.define('pedidos_itens', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_produto: {
            type: DataTypes.INTEGER,
            foreignKey: true
        },
        pedido_id: {
            type: DataTypes.INTEGER,
            foreignKey: true
        },
        produto: { type: DataTypes.STRING },
        preco: { type: DataTypes.DECIMAL(10, 4) },
        qtde: { type: DataTypes.DECIMAL(10, 4) },
        total: { type: DataTypes.DECIMAL(10, 4) },
        peso: { type: DataTypes.DECIMAL(10, 4) }



    });
    return pedidosItens;
}