const Pagamento = require('../models/Pagamento');

class pagamentoController {
    async processarPagamento(req, res) {
        const pagamentoData = req.body;

        try {
            const pagamentoId = await Pagamento.processarPagamento(pagamentoData);
            res.status(201).json({ pagamentoId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    async cancelarPagamento(req, res) {
        const { pagamentoId } = req.params;

        try {
            await Pagamento.cancelarPagamento(pagamentoId);
            res.status(200).json({ message: 'Pagamento cancelado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = new pagamentoController