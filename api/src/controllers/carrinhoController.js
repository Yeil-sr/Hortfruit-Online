const Carrinho = require('../models/Carrinho');

class CarrinhoController {
    static async addItem(req, res) {
        const { userId, produtoId, quantidade } = req.body;

        try {
            const result = await Carrinho.addItemById(userId, produtoId, quantidade);
            res.status(200).json(result);
        } catch (err) {
            console.error('Erro ao adicionar item ao carrinho:', err);
            res.status(500).json({ error: 'Erro ao adicionar item ao carrinho' });
        }
    }

    static async updateItem(req, res) {
        const { userId, produtoId, quantidade } = req.body;

        try {
            const result = await Carrinho.updateItem(userId, produtoId, quantidade);
            res.status(200).json(result);
        } catch (err) {
            console.error('Erro ao atualizar item do carrinho:', err);
            res.status(500).json({ error: 'Erro ao atualizar item do carrinho' });
        }
    }

    static async calcularTotal(req, res) {
        const { userId } = req.params;

        try {
            const total = await Carrinho.calcularTotal(userId);
            res.status(200).json({ total });
        } catch (err) {
            console.error('Erro ao calcular total do carrinho:', err);
            res.status(500).json({ error: 'Erro ao calcular total do carrinho' });
        }
    }

    static async limparCarrinho(req, res) {
        const { userId } = req.params;

        try {
            const result = await Carrinho.limparCarrinho(userId);
            res.status(200).json(result);
        } catch (err) {
            console.error('Erro ao limpar carrinho:', err);
            res.status(500).json({ error: 'Erro ao limpar carrinho' });
        }
    }
}

module.exports = CarrinhoController;
