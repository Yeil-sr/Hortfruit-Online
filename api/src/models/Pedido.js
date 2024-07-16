const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');
const PedidoItem = require('./PedidoItem');

class Pedido extends Model {
    static async createPedido(userId, pagamentoId, valor_total, endereco, mesmaEntrega, salvarInfo) {
        const transaction = await sequelize.transaction();
    
        try {
            const itens = await sequelize.models.PedidoItem.findAll({ where: { user_id: userId }, transaction });
            if (itens.length === 0) {
                throw new Error('Carrinho está vazio');
            }
    
            const pagamento = await sequelize.models.Pagamento.findByPk(pagamentoId, { transaction });
            if (!pagamento) {
                throw new Error('Pagamento não encontrado');
            }
    
            const pedido = await Pedido.create({
                user_id: userId,
                valor_total,
                pagamento_id: pagamentoId,
                data_venda: new Date(),
                endereco,
                mesma_entrega: mesmaEntrega,
                salvar_info: salvarInfo
            }, { transaction });
    
            const pedidoItems = itens.map(item => ({
                pedido_id: pedido.id,
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                valor_produto: item.valor_produto
            }));
    
            await sequelize.models.PedidoItem.bulkCreate(pedidoItems, { transaction });
            await PedidoItem.limparCarrinho(userId, { transaction });
    
            await transaction.commit();
            return { pedidoId: pedido.id, valor_total };
        } catch (error) {
            await transaction.rollback();
            console.error('Erro ao criar pedido:', error);
            throw error;
        }
    }
    
    static async atualizarPedido(pedidoId, dadosPedido) {
        const [updated] = await Pedido.update(dadosPedido, {
            where: { id: pedidoId }
        });
        return updated;
    }

    static async cancelarPedido(pedidoId) {
        const [updated] = await Pedido.update({ status: 'cancelado' }, {
            where: { id: pedidoId }
        });
        return updated;
    }
}

Pedido.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    valor_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    pagamento_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data_venda: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mesma_entrega: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    salvar_info: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pendente'
    }
}, {
    sequelize,
    modelName: 'Pedido',
    tableName: 'pedido',
    timestamps: false
});

Pedido.hasMany(PedidoItem, { foreignKey: 'pedido_id' });
PedidoItem.belongsTo(Pedido, { foreignKey: 'pedido_id' });

module.exports = Pedido;
