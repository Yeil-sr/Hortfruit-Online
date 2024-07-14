const Pedido = require('../models/Pedido');

class PedidoController {
    async createPedido(req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }

            const userId = req.session.user.id;
            const { pagamentoId, valor_total, endereco, mesmaEntrega, salvarInfo } = req.body;

            // Verifica se valor_total foi enviado
            if (valor_total == null) {
                return res.status(400).json({ error: 'Valor total é obrigatório' });
            }

            // Cria o pedido no banco de dados
            const { pedidoId } = await Pedido.createPedido(userId, pagamentoId, valor_total, endereco, mesmaEntrega, salvarInfo);
            res.status(201).json({ pedidoId, valor_total });
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async atualizarPedido(req, res) {
        const { pedidoId } = req.params;
        const dadosPedido = req.body;

        try {
            const [updated] = await Pedido.atualizarPedido(pedidoId, dadosPedido);
            if (updated) {
                res.status(200).json({ message: 'Pedido atualizado com sucesso' });
            } else {
                res.status(404).json({ error: 'Pedido não encontrado' });
            }
        } catch (error) {
            console.error('Erro ao atualizar pedido:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async cancelarPedido(req, res) {
        const { pedidoId } = req.params;

        try {
            const [updated] = await Pedido.cancelarPedido(pedidoId);
            if (updated) {
                res.status(200).json({ message: 'Pedido cancelado com sucesso' });
            } else {
                res.status(404).json({ error: 'Pedido não encontrado' });
            }
        } catch (error) {
            console.error('Erro ao cancelar pedido:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PedidoController();
