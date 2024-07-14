const { sequelize, DataTypes } = require('../../db'); // Adjust import based on your db config
const Usuario = require('./Usuario');
const Produto = require('./Produto'); // Ensure Produto model is imported

class PedidoItem {
    // Define the model
    static init(sequelize) {
        return sequelize.define('PedidoItem', {
            pedido_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            produto_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            quantidade: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            valor_produto: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        }, {
            tableName: 'pedido_item',
            timestamps: false,
        });
    }

    static async getPendingPedidoId(userId) {
        const user = await Usuario.findById(userId);
        if (!user) {
            throw new Error(`User with id ${userId} not found.`);
        }

        const pedido = await sequelize.query(`
            SELECT id FROM pedido 
            WHERE user_id = ? AND status = 'pendente'
        `, {
            replacements: [userId],
            type: sequelize.QueryTypes.SELECT,
        });

        if (pedido.length > 0) {
            return pedido[0].id;
        } else {
            const result = await sequelize.query(`
                INSERT INTO pedido (user_id, valor_total, status, data_venda) 
                VALUES (?, 0, 'pendente', NOW())
            `, {
                replacements: [userId],
                type: sequelize.QueryTypes.INSERT,
            });
            return result[0]; // Return the newly created ID
        }
    }

    static async addItemById(userId, produtoId, quantidade) {
        const pedidoId = await this.getPendingPedidoId(userId);

        await sequelize.query(`
            INSERT INTO pedido_item (pedido_id, produto_id, quantidade, valor_produto)
            SELECT ?, ?, ?, p.preco
            FROM produto p
            WHERE p.id = ?
            ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)
        `, {
            replacements: [pedidoId, produtoId, quantidade, produtoId],
        });
    }

    static async updateItem(userId, produtoId, quantidade) {
        const pedidoId = await this.getPendingPedidoId(userId);
        await sequelize.query(`
            UPDATE pedido_item 
            SET quantidade = ? 
            WHERE pedido_id = ? AND produto_id = ?
        `, {
            replacements: [quantidade, pedidoId, produtoId],
        });
    }

    static async calcularTotal(userId) {
        const pedidoId = await this.getPendingPedidoId(userId);
        const result = await sequelize.query(`
            SELECT SUM(p.preco * i.quantidade) as total 
            FROM pedido_item i 
            JOIN produto p ON i.produto_id = p.id 
            WHERE i.pedido_id = ?
        `, {
            replacements: [pedidoId],
            type: sequelize.QueryTypes.SELECT,
        });
        return result[0].total;
    }

    static async limparCarrinho(userId) {
        const pedidoId = await this.getPendingPedidoId(userId);
        await sequelize.query(`
            DELETE FROM pedido_item 
            WHERE pedido_id = ?
        `, {
            replacements: [pedidoId],
        });
    }
}

module.exports = PedidoItem;
