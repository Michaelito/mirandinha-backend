module.exports = (sequelize, DataTypes) => {
  const Pedido = sequelize.define(
    "michaelpedidos",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_periodo: {
        type: DataTypes.INTEGER,
      },
      id_pedido_controle: {
        type: DataTypes.INTEGER,
      },
      id_empresa: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      data_pedido: {
        type: DataTypes.DATE,
      },
      id_cliente: {
        type: DataTypes.INTEGER,
      },
      id_cliente_endereco: {
        type: DataTypes.INTEGER,
      },
      valor_pedido: {
        type: DataTypes.DECIMAL(19, 2),
      },
      valor_informado: {
        type: DataTypes.DECIMAL(19, 2),
      },
      valor_taxa: {
        type: DataTypes.DECIMAL(19, 2),
      },
      valor_extra: {
        type: DataTypes.DECIMAL(19, 2),
      },
      valor_troco: {
        type: DataTypes.DECIMAL(19, 2),
      },
      valor_desconto: {
        type: DataTypes.DECIMAL(19, 2),
      },
      valor_total: {
        type: DataTypes.DECIMAL(19, 2),
      },
      emitir_cpf: {
        type: DataTypes.INTEGER,
      },
      obs_pedido: {
        type: DataTypes.TEXT,
      },
      etapa: {
        type: DataTypes.INTEGER,
        comment: "0= Aberto 1, 2=Produção, 3=Despacho, 4=Entrega, 5=Retorno Entrega, = 6=Cancelado",
      },
      data_hora_confirmacao: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      togo: {
        type: DataTypes.INTEGER,
        comment: "0 = false 1= true",
      },
      tipo_entrega: {
        type: DataTypes.INTEGER,
        comment: "Balcão = false 2= Delivery, 3= Retirada",
      },
      driver: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      data_hora_saida: {
        type: DataTypes.DATE,
      },
      data_hora_chegada: {
        type: DataTypes.DATE,
      },
      id_atendente: {
        type: DataTypes.INTEGER,
      },
      cancelado: {
        type: DataTypes.INTEGER,

        defaultValue: 0,
      },
      data_hora_cancelamento: {
        type: DataTypes.DATE,
      },
      id_cancelamento: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      id_motivo_cancelamento: {
        type: DataTypes.INTEGER,

        defaultValue: 0,
      },
      ordenar: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "michaelpedidos",
      timestamps: false, // No createdAt/updatedAt columns
    }
  );

  return Pedido;
};
