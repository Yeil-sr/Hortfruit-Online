const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class PedidoItem extends Model {
    static async limparCarrinho(userId, transaction) {
        return await PedidoItem.destroy({
            where: { user_id: userId },
            transaction
        });
    }
}

PedidoItem.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    valor_produto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'PedidoItem',
    tableName: 'pedido_item',
    timestamps: false
});

module.exports = PedidoItem;
