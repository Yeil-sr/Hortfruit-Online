const Carrinho = require('../models/Carrinho');

class CarrinhoController {
    static async addItem(req, res) {
        const { produtoId, quantidade } = req.body;

        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }

            const userId = req.session.user.id;
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
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }
    
            const { userId } = req.params;
            const { valor_total } = req.body;
    
            if (valor_total === undefined || valor_total === null) {
                return res.status(400).json({ error: 'Valor total não fornecido' });
            }
    
            // Retorna o valor_total calculado
            res.status(200).json({ valor_total });
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
