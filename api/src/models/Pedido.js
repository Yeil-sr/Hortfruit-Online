const { db } = require('../../db');
const Carrinho = require('./Carrinho');

class Pedido {
    static async createPedido(userId, pagamentoId) {
        return new Promise(async (resolve, reject) => {
            try {
                // Calcular total do carrinho
                const total = await Carrinho.calcularTotal(userId);
                if (total === 0) {
                    throw new Error('Carrinho vazio');
                }

                // Iniciar transação
                await db.beginTransaction();

                // Criar pedido
                const qPedido = `
                    INSERT INTO pedido (user_id, valor_total, pagamento_id, data_venda) 
                    VALUES (?, ?, ?, NOW())
                `;
                const [resultPedido] = await db.query(qPedido, [userId, total, pagamentoId]);
                const pedidoId = resultPedido.insertId;

                // Transferir itens do carrinho para itens do pedido
                const qItensPedido = `
                    INSERT INTO pedido_item (pedido_id, produto_id, quantidade, valor_produto)
                    SELECT ?, c.produto_id, c.quantidade, p.preco
                    FROM carrinho c 
                    JOIN produto p ON c.produto_id = p.id 
                    WHERE c.user_id = ?
                `;
                await db.query(qItensPedido, [pedidoId, userId]);

                // Limpar carrinho
                await Carrinho.limparCarrinho(userId);

                // Commit transação
                await db.commit();

                resolve({ pedidoId, total });
            } catch (error) {
                await db.rollback();
                console.error('Erro ao criar pedido:', error);
                reject(error);
            }
        });
    }

    static async atualizarPedido(pedidoId, dadosPedido) {
        return new Promise((resolve, reject) => {
            const q = `
                UPDATE pedido 
                SET status = ?, observacao = ? 
                WHERE id = ?
            `;
            const { status, observacao } = dadosPedido;
            db.query(q, [status, observacao, pedidoId], (err, result) => {
                if (err) {
                    console.error('Erro ao atualizar pedido:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static async cancelarPedido(pedidoId) {
        return new Promise((resolve, reject) => {
            const q = `
                UPDATE pedido 
                SET status = 'cancelado' 
                WHERE id = ?
            `;
            db.query(q, [pedidoId], (err, result) => {
                if (err) {
                    console.error('Erro ao cancelar pedido:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}

module.exports = Pedido;
