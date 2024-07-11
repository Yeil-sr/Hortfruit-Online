const Pagamento = require('../models/Pagamento');

class PagamentoController {
    async processarPagamento(req, res) {
        const { tipo, metodo, parceladas, cartao, boleto } = req.body;

        try {
            let pagamentoId;

            if (tipo === 'cartao') {
                const { titular, numCartao, dataExpiracao, cvv } = cartao;
                pagamentoId = await Pagamento.processarPagamento({
                    tipo,
                    metodo,
                    parceladas,
                    cartao: { titular, numCartao, dataExpiracao, cvv }
                });
            } else if (tipo === 'boleto') {
                const { dataVencimento, instrucoes } = boleto;
                pagamentoId = await Pagamento.processarPagamento({
                    tipo,
                    metodo,
                    parceladas,
                    boleto: { dataVencimento, instrucoes }
                });
            } else {
                throw new Error('Tipo de pagamento inválido');
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
