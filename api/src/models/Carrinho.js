const { db } = require('../../db');
const Usuario = require('./Usuario')

class Carrinho {
    static async getPendingPedidoId(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                // Ensure user exists
                const user = await Usuario.findById(userId);
                if (!user) {
                    return reject(new Error(`User with id ${userId} not found.`));
                }

                const q = `
                    SELECT id FROM pedido 
                    WHERE user_id = ? AND status = 'pendente'
                `;
                db.query(q, [userId], (err, result) => {
                    if (err) {
                        console.error('Erro ao obter pedido pendente:', err);
                        return reject(err);
                    }
                    if (result.length > 0) {
                        resolve(result[0].id);
                    } else {
                        const qCreatePedido = `
                            INSERT INTO pedido (user_id, valor_total, status, data_venda) 
                            VALUES (?, 0, 'pendente', NOW())
                        `;
                        db.query(qCreatePedido, [userId], (err, result) => {
                            if (err) {
                                console.error('Erro ao criar pedido pendente:', err);
                                return reject(err);
                            }
                            resolve(result.insertId);
                        });
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static async addItemById(userId, produtoId, quantidade) {
        return new Promise(async (resolve, reject) => {
            try {
                // Ensure user exists
                const user = await Usuario.findById(userId);
                if (!user) {
                    return reject(new Error(`User with id ${userId} not found.`));
                }

                const pedidoId = await this.getPendingPedidoId(userId);
    
                // Now, insert into pedido_item
                const q = `
                    INSERT INTO pedido_item (pedido_id, produto_id, quantidade, valor_produto)
                    SELECT ?, ?, ?, p.preco
                    FROM produto p
                    WHERE p.id = ?
                    ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)
                `;
                db.query(q, [pedidoId, produtoId, quantidade, produtoId], (err, result) => {
                    if (err) {
                        console.error('Erro ao adicionar item ao carrinho:', err);
                        return reject(err);
                    }
                    resolve(result);
                });
            } catch (error) {
                console.error('Erro ao adicionar item ao carrinho:', error);
                reject(error);
            }
        });
    }



    static async updateItem(userId, produtoId, quantidade) {
        return new Promise(async (resolve, reject) => {
            try {
                const pedidoId = await this.getPendingPedidoId(userId);
                const q = `
                    UPDATE pedido_item 
                    SET quantidade = ? 
                    WHERE pedido_id = ? AND produto_id = ?
                `;
                db.query(q, [quantidade, pedidoId, produtoId], (err, result) => {
                    if (err) {
                        console.error('Erro ao atualizar item do carrinho:', err);
                        return reject(err);
                    }
                    resolve(result);
                });
            } catch (error) {
                console.error('Erro ao atualizar item do carrinho:', error);
                reject(error);
            }
        });
    }

    static async calcularTotal(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const q = `
                    SELECT SUM(p.preco * i.quantidade) as total 
                    FROM pedido_item i 
                    JOIN produto p ON i.produto_id = p.id 
                    WHERE i.pedido_id = ?
                `;
                db.query(q, [userId], (err, result) => {
                    if (err) {
                        console.error('Erro ao calcular total do carrinho:', err);
                        return reject(err);
                    }
                    resolve(result[0].total);
                });
            } catch (error) {
                console.error('Erro ao calcular total do carrinho:', error);
                reject(error);
            }
        });
    }
    
    static async limparCarrinho(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const pedidoId = await this.getPendingPedidoId(userId);
                const q = `
                    DELETE FROM pedido_item 
                    WHERE pedido_id = ?
                `;
                db.query(q, [pedidoId], (err, result) => {
                    if (err) {
                        console.error('Erro ao limpar carrinho:', err);
                        return reject(err);
                    }
                    resolve(result);
                });
            } catch (error) {
                console.error('Erro ao limpar carrinho:', error);
                reject(error);
            }
        });
    }
}

module.exports = Carrinho;
