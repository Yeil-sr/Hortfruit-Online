const Pagamento = require('../models/Pagamento');

class PagamentoController {
    async processarPagamento(req, res) {
        const { tipo, metodo, parceladas, cartao, boleto } = req.body;

        try {
            let pagamentoId;

            if (tipo === 'cartao') {
                // Verifica se todos os dados do cartão foram fornecidos
                if (!cartao || !cartao.titular || !cartao.numCartao || !cartao.dataExpiracao || !cartao.cvv) {
                    return res.status(400).json({ error: 'Dados do cartão incompletos' });
                }

                pagamentoId = await Pagamento.processarPagamento({
                    tipo,
                    metodo,
                    parceladas,
                    cartao: {
                        titular: cartao.titular,
                        numCartao: cartao.numCartao,
                        dataExpiracao: cartao.dataExpiracao,
                        cvv: cartao.cvv
                    }
                });
            } else if (tipo === 'boleto') {
                // Verifica se todos os dados do boleto foram fornecidos
                if (!boleto || !boleto.dataVencimento || !boleto.instrucoes) {
                    return res.status(400).json({ error: 'Dados do boleto incompletos' });
                }

                pagamentoId = await Pagamento.processarPagamento({
                    tipo,
                    metodo,
                    parceladas,
                    boleto: {
                        dataVencimento: boleto.dataVencimento,
                        instrucoes: boleto.instrucoes
                    }
                });
            } else {
                return res.status(400).json({ error: 'Tipo de pagamento inválido' });
            }

            res.status(201).json({ pagamentoId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async cancelarPagamento(req, res) {
        const { pagamentoId } = req.params;

        try {
            await Pagamento.cancelarPagamento(pagamentoId);
            res.status(200).json({ message: 'Pagamento cancelado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PagamentoController();
