const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db'); // Ensure this imports your sequelize instance
const PedidoItem = require('./PedidoItem'); // Assuming this is correctly defined

class Pedido extends Model {
    static async createPedido(userId, pagamentoId, valor_total, endereco, mesmaEntrega, salvarInfo) {
        const transaction = await sequelize.transaction();
        
        try {
            // Check if pagamentoId exists in the pagamento table
            const pagamento = await sequelize.models.Pagamento.findByPk(pagamentoId, { transaction });
            if (!pagamento) {
                throw new Error('Pagamento não encontrado');
            }

            // Create the pedido
            const pedido = await Pedido.create({
                user_id: userId,
                valor_total,
                pagamento_id: pagamentoId,
                data_venda: new Date(),
                endereco,
                mesma_entrega: mesmaEntrega,
                salvar_info: salvarInfo
            }, { transaction });

            // Transferir itens do Carrinho para pedido_item
            const itens = await PedidoItem.findAll({ where: { user_id: userId }, transaction });
            const pedidoItems = itens.map(item => ({
                pedido_id: pedido.id,
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                valor_produto: item.valor_produto
            }));

            await sequelize.models.Pedido_item.bulkCreate(pedidoItems, { transaction });

            // Limpar o Carrinho
            await PedidoItem.limparCarrinho(userId, { transaction });

            // Commit transaction
            await transaction.commit();
            return { pedidoId: pedido.id, valor_total };
        } catch (error) {
            await transaction.rollback();
            console.error('Erro ao criar pedido:', error);
            throw error;
        }
    }

    static async atualizarPedido(pedidoId, dadosPedido) {
        return await Pedido.update(dadosPedido, {
            where: { id: pedidoId }
        });
    }

    static async cancelarPedido(pedidoId) {
        return await Pedido.update({ status: 'cancelado' }, {
            where: { id: pedidoId }
        });
    }
}

// Define the model attributes and options
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
        defaultValue: 'pendente' // Define default status
    }
}, {
    sequelize,
    modelName: 'Pedido',
    tableName: 'pedido',
    timestamps: false // Set to true if using createdAt/updatedAt fields
});

module.exports = Pedido;
