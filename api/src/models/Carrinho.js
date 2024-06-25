const { db } = require('../../db');

class Carrinho {
    static async addItemById(userId, produtoId, quantidade) {
        return new Promise((resolve, reject) => {
            const q = `
                INSERT INTO carrinho (user_id, produto_id, quantidade)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)
            `;
            db.query(q, [userId, produtoId, quantidade], (err, result) => {
                if (err) {
                    console.error('Erro ao adicionar item ao carrinho:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static async updateItem(userId, produtoId, quantidade) {
        return new Promise((resolve, reject) => {
            const q = `
                UPDATE carrinho 
                SET quantidade = ? 
                WHERE user_id = ? AND produto_id = ?
            `;
            db.query(q, [quantidade, userId, produtoId], (err, result) => {
                if (err) {
                    console.error('Erro ao atualizar item do carrinho:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static async calcularTotal(userId) {
        return new Promise((resolve, reject) => {
            const q = `
                SELECT SUM(p.preco * c.quantidade) as total 
                FROM carrinho c 
                JOIN produto p ON c.produto_id = p.id 
                WHERE c.user_id = ?
            `;
            db.query(q, [userId], (err, result) => {
                if (err) {
                    console.error('Erro ao calcular total do carrinho:', err);
                    return reject(err);
                }
                resolve(result[0].total);
            });
        });
    }

    static async limparCarrinho(userId) {
        return new Promise((resolve, reject) => {
            const q = `
                DELETE FROM carrinho 
                WHERE user_id = ?
            `;
            db.query(q, [userId], (err, result) => {
                if (err) {
                    console.error('Erro ao limpar carrinho:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}

module.exports = Carrinho;
