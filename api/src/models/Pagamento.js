const { db } = require('../../db');

class Pagamento {
    static async processarPagamento({ tipo, numCartao, dataExpiracao, codigoSeguranca, valor }) {
        return new Promise((resolve, reject) => {
            const q = `
                INSERT INTO pagamento (tipo, num_cartao, data_expiracao, codigo_seguranca, valor, data_pagamento)
                VALUES (?, ?, ?, ?, ?, NOW())
            `;
            db.query(q, [tipo, numCartao, dataExpiracao, codigoSeguranca, valor], (err, result) => {
                if (err) {
                    console.error('Erro ao processar pagamento:', err);
                    return reject(err);
                }
                resolve(result.insertId);
            });
        });
    }

    static async cancelarPagamento(pagamentoId) {
        return new Promise((resolve, reject) => {
            const q = `
                UPDATE pagamento 
                SET status = 'cancelado' 
                WHERE id = ?
            `;
            db.query(q, [pagamentoId], (err, result) => {
                if (err) {
                    console.error('Erro ao cancelar pagamento:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}

module.exports = Pagamento;
