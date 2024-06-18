const Produto = require("../models/Produto.js");
const Fornecedor = require('../models/Fornecedor.js');
const upload = require('../multerConfig/multerConfig');

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
            if (!req.session.user) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }

            const userId = req.session.user.id;
            const fornecedor = await Fornecedor.findByUsuarioId(userId);
            if (!fornecedor) {
                return res.status(404).json({ error: 'Fornecedor não encontrado' });
            }
            const fornecedor_id = fornecedor.id;
            const produtos = await Produto.findByFornecedorId(fornecedor_id);
            res.json(produtos);
        } catch (error) {
            console.error('Erro ao obter a lista de produtos do fornecedor:', error);
            res.status(500).json({ error: 'Erro ao obter a lista de produtos do fornecedor' });
        }
    }

    async addProduto(req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }

            const userId = req.session.user.id;
            const fornecedor = await Fornecedor.findByUsuarioId(userId);
            if (!fornecedor) {
                return res.status(404).json({ error: 'Fornecedor não encontrado' });
            }
            const fornecedor_id = fornecedor.id;

            const { nome, tipo, unidade, cod, quantidade, preco, descricao } = req.body;

            if (!nome || !tipo || !unidade || !cod || !quantidade || !preco || !descricao) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            const img_produto = req.file ? req.file.filename : null;

            await Produto.addProduto({ nome, tipo, unidade, cod, quantidade, preco, descricao, fornecedor_id, img_produto });

            res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
        } catch (error) {
            console.error('Erro ao adicionar o produto:', error);
            res.status(500).json({ error: 'Erro ao adicionar o produto' });
        }
    }

    async updateProduto(req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }

            const userId = req.session.user.id;
            const fornecedor = await Fornecedor.findByUsuarioId(userId);
            if (!fornecedor) {
                return res.status(404).json({ error: 'Fornecedor não encontrado' });
            }
            const fornecedor_id = fornecedor.id;

            const { id } = req.params;
            const { nome, tipo, unidade, cod, quantidade, preco, descricao } = req.body;

            if (!nome || !tipo || !unidade || !cod || !quantidade || !preco || !descricao) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            const img_produto = req.file ? req.file.filename : null;

            const result = await Produto.updateProduto(id, { nome, tipo, unidade, cod, quantidade, preco, descricao, fornecedor_id, img_produto });

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
            if (!req.session.user) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }

            const userId = req.session.user.id;
            const fornecedor = await Fornecedor.findByUsuarioId(userId);
            if (!fornecedor) {
                return res.status(404).json({ error: 'Fornecedor não encontrado' });
            }
            const fornecedor_id = fornecedor.id;
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
            if (!req.session.user) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }

            const userId = req.session.user.id;
            const fornecedor = await Fornecedor.findByUsuarioId(userId);
            if (!fornecedor) {
                return res.status(404).json({ error: 'Fornecedor não encontrado' });
            }
            const fornecedor_id = fornecedor.id;

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
