const { db } = require('../../db');
const Carrinho = require('./Carrinho');

class Pedido {
    static async createPedido(userId, pagamentoId, valor_total, endereco, mesmaEntrega, salvarInfo, data_venda) {
        return new Promise(async (resolve, reject) => {
            try {
                // Verificar se pagamentoId existe na tabela de pagamento
                const qCheckPagamento = `
                    SELECT id FROM pagamento WHERE id = ?
                `;
                db.query(qCheckPagamento, [pagamentoId], async (err, result) => {
                    if (err) {
                        console.error('Erro ao verificar pagamento:', err);
                        return reject(err);
                    }
                    if (result.length === 0) {
                        return reject(new Error('Pagamento não encontrado'));
                    }
    
                    // Iniciar transação
                    await db.beginTransaction();
    
                    try {
                        // Inserir na tabela de pedido
                        const qPedido = `
                            INSERT INTO pedido (user_id, valor_total, pagamento_id, data_venda, endereco, mesma_entrega, salvar_info) 
                            VALUES (?, ?, ?, NOW(), ?, ?, ?)
                        `;
                        db.query(qPedido, [userId, valor_total, pagamentoId, endereco, mesmaEntrega, salvarInfo], (err, resultPedido) => {
                            if (err) {
                                throw new Error(err);
                            }
    
                            const pedidoId = resultPedido.insertId;
    
                            // Transferir itens do Produto para pedido_item
                            const qItensPedido = `
                                INSERT INTO pedido_item (pedido_id, produto_id, quantidade, valor_produto)
                                SELECT ?, p.id, p.quantidade, p.preco
                                FROM produto p 
                                WHERE p.fornecedor_id = ?
                            `;
                            db.query(qItensPedido, [pedidoId, userId], async (err, resultItensPedido) => {
                                if (err) {
                                    throw new Error(err);
                                }
    
                                // Limpar Carrinho
                                await Carrinho.limparCarrinho(userId);
    
                                // Commit transação
                                await db.commit();
    
                                resolve({ pedidoId, valor_total });
                            });
                        });
                    } catch (error) {
                        // Rollback transação em caso de erro interno
                        await db.rollback();
                        console.error('Erro ao criar pedido:', error);
                        reject(error);
                    }
                });
            } catch (error) {
                console.error('Erro geral ao criar pedido:', error);
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
