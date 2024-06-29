const Pedido = require('../models/Pedido');

class pedidoController {

    async createPedido(req, res) {
        const userId = req.user.id; // Supondo que o middleware de autenticação adiciona o usuário ao objeto req
        const { pagamentoId } = req.body;

        try {
            const { pedidoId, total } = await Pedido.createPedido(userId, pagamentoId);
            res.status(201).json({ pedidoId, total });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    async atualizarPedido(req, res) {
        const { pedidoId } = req.params;
        const dadosPedido = req.body;

        try {
            await Pedido.atualizarPedido(pedidoId, dadosPedido);
            res.status(200).json({ message: 'Pedido atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    async cancelarPedido(req, res) {
        const { pedidoId } = req.params;

        try {
            await Pedido.cancelarPedido(pedidoId);
            res.status(200).json({ message: 'Pedido cancelado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = new pedidoController();