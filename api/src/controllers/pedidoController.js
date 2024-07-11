const Pedido = require('../models/Pedido');

class pedidoController {

    async createPedido(req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }

            const userId = req.session.user.id;
            const { pagamentoId, valor_total, endereco, mesmaEntrega, salvarInfo, data_venda } = req.body;

            // Verifica se valor_total foi enviado
            if (valor_total == null) {
                return res.status(400).json({ error: 'Valor total é obrigatório' });
            }

            // Cria o pedido no banco de dados
            const { pedidoId } = await Pedido.createPedido(userId, pagamentoId, valor_total, endereco, mesmaEntrega, salvarInfo, data_venda);
            res.status(201).json({ pedidoId, valor_total });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async atualizarPedido(req, res) {
        const { pedidoId } = req.params;
        const dadosPedido = req.body;

        try {
            await Pedido.atualizarPedido(pedidoId, dadosPedido);
            res.status(200).json({ message: 'Pedido atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async cancelarPedido(req, res) {
        const { pedidoId } = req.params;

        try {
            await Pedido.cancelarPedido(pedidoId);
            res.status(200).json({ message: 'Pedido cancelado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new pedidoController();
