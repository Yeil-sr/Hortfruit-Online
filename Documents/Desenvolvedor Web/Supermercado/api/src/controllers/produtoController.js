const Produto = require("../models/Produto.js");

class ProdutoController {
    async index(req, res) {
        try {
            const produtos = await Produto.findAll();
            res.json(produtos);
        } catch (error) {
            console.error('Erro ao obter a lista de produtos:', error);
            res.status(500).json({ error: 'Erro ao obter a lista de produtos' });
        }
    }

    async getProdutosByFornecedor(req, res) {
        try {
            const { fornecedor_id } = req.params;
            const produtos = await Produto.findByFornecedorId(fornecedor_id);
            res.json(produtos);
        } catch (error) {
            console.error('Erro ao obter a lista de produtos do fornecedor:', error);
            res.status(500).json({ error: 'Erro ao obter a lista de produtos do fornecedor' });
        }
    }

    
    async addProduto(req, res) {
        try {
            // Obter o fornecedor_id da sessão
            const fornecedor_id = req.params;

            // Restante do código permanece o mesmo
            const { nome, tipo, unidade, cod, quantidade, preco, descricao } = req.body;
            
            if (!nome || !tipo || !unidade || !cod || !quantidade || !preco || !descricao || !fornecedor_id) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            await Produto.addProduto({ nome, tipo, unidade, cod, quantidade, preco, descricao, fornecedor_id });

            res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
        } catch (error) {
            console.error('Erro ao adicionar o produto:', error);
            res.status(500).json({ error: 'Erro ao adicionar o produto' });
        }
    }

    async updateProduto(req, res) {
        try {
            const { id } = req.params;
            const { nome, tipo, unidade, cod, quantidade, preco, descricao, fornecedor_id } = req.body;
            
            if (!nome || !tipo || !unidade || !cod || !quantidade || !preco || !descricao || !fornecedor_id) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            const result = await Produto.updateProduto(id, { nome, tipo, unidade, cod, quantidade, preco, descricao, fornecedor_id });

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Produto não encontrado ou nenhum dado foi alterado' });
            }

            res.status(200).json({ message: 'Produto atualizado com sucesso!' });
        } catch (error) {
            console.error('Erro ao atualizar o produto:', error);
            res.status(500).json({ error: 'Erro ao atualizar o produto' });
        }
    }

    async deleteProduto(req, res) {
        try {
            const { id } = req.params;
            await Produto.deleteProduto(id);
            res.status(200).json({ message: 'Produto deletado com sucesso!' });
        } catch (error) {
            console.error('Erro ao deletar o produto:', error);
            res.status(500).json({ error: 'Erro ao deletar o produto' });
        }
    }

    async editarProduto(req, res) {
        try {
            const { id } = req.params;
            const produto = await Produto.findById(id);
            res.json(produto);
        } catch (error) {
            console.error('Erro ao preencher o formulário de edição de produto:', error);
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new ProdutoController();
