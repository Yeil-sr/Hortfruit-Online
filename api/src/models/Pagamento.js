const { db } = require('../../db');

class Pagamento {
    static async processarPagamento({ tipo, metodo, parceladas, cartao, boleto }) {
        return new Promise((resolve, reject) => {
            const { titular, numCartao, dataExpiracao, cvv } = cartao || {};
            const { dataVencimento, instrucoes } = boleto || {};

            let q = `
                INSERT INTO pagamento (tipo, metodo, parceladas, titular, num_cartao, data_expiracao, codigo_seguranca, data_pagamento, data_vencimento, instrucoes)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
            `;
            let params = [tipo, metodo, parceladas, titular, numCartao, dataExpiracao, cvv, dataVencimento, JSON.stringify(instrucoes)];

            if (tipo !== 'cartao') {
                q = `
                    INSERT INTO pagamento (tipo, metodo, data_pagamento, data_vencimento, instrucoes)
                    VALUES (?, ?, NOW(), ?, ?)
                `;
                params = [tipo, metodo, dataVencimento, JSON.stringify(instrucoes)];
            }

            db.query(q, params, (err, result) => {
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
