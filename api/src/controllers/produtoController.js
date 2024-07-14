const Produto = require("../models/Produto.js");
const Fornecedor = require('../models/Fornecedor.js');
const upload = require('../multerConfig/multerConfig');
const path = require('path');
const fs = require('fs');

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
            const produtos = await Produto.findByFornecedorId(fornecedor.id);
            res.json(produtos);
        } catch (error) {
            console.error('Erro ao obter a lista de produtos do fornecedor:', error);
            res.status(500).json({ error: 'Erro ao obter a lista de produtos do fornecedor' });
        }
    }

    async getProdutoById(req, res) {
        try {
            const { id } = req.params;
            const produto = await Produto.findById(id);
            if (!produto) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            res.json(produto);
        } catch (error) {
            console.error('Erro ao encontrar produto:', error);
            res.status(500).json({ error: 'Erro ao encontrar produto' });
        }
    }

    async getPictureByProdutoId(req, res) {
        try {
            const produto_id = req.params.id;
            const produto = await Produto.findById(produto_id);

            if (!produto || !produto.img_produto) {
                return res.status(404).json({ error: 'Imagem não encontrada' });
            }

            const imagePath = path.join(__dirname, produto.img_produto);
            res.sendFile(imagePath);
        } catch (error) {
            console.error('Erro ao obter imagem do produto:', error);
            res.status(500).json({ error: 'Erro ao obter imagem do produto' });
        }
    }
    
    async addProduto(req, res) {
        try {
            const userId = req.session.user.id;
            const fornecedor = await Fornecedor.findByUsuarioId(userId);
            if (!fornecedor) {
                return res.status(404).json({ error: 'Fornecedor não encontrado' });
            }

            const { nome, tipo, unidade, cod, quantidade, preco, descricao } = req.body;

            if (!nome || !tipo || !unidade || !cod || !quantidade || !preco || !descricao) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            let img_produto = null;
            if (req.file) {
                const imgPath = path.join(__dirname, '../uploads', `${fornecedor.id}_${cod}.jpg`);
                fs.writeFileSync(imgPath, req.file.buffer);
                img_produto = `../uploads/${fornecedor.id}_${cod}.jpg`; // Save relative path
            }

            await Produto.addProduto({
                nome, tipo, unidade, cod, quantidade, preco, descricao,
                fornecedor_id: fornecedor.id, img_produto
            });

            res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
        } catch (error) {
            console.error('Erro ao adicionar o produto:', error);
            res.status(500).json({ error: 'Erro ao adicionar o produto' });
        }
    }
    
    


    async updateProduto(req, res) {
        try {
            const userId = req.session.user.id;
            const fornecedor = await Fornecedor.findByUsuarioId(userId);
            if (!fornecedor) {
                return res.status(404).json({ error: 'Fornecedor não encontrado' });
            }

            const { id } = req.params;
            const { nome, tipo, unidade, cod, quantidade, preco, descricao } = req.body;

            if (!nome || !tipo || !unidade || !cod || !quantidade || !preco || !descricao) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            let img_produto = null;
            if (req.file) {
                const imgPath = path.join(__dirname, '../uploads', `${fornecedor.id}_${cod}.jpg`);
                fs.writeFileSync(imgPath, req.file.buffer);
                img_produto = `../uploads/${fornecedor.id}_${cod}.jpg`; // Save relative path
            }

            await Produto.updateProduto(id, {
                nome, tipo, unidade, cod, quantidade, preco, descricao,
                fornecedor_id: fornecedor.id, img_produto
            });

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

            const { id } = req.params;
            const produto = await Produto.findById(id);
            if (!produto) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }

            res.json(produto);
        } catch (error) {
            console.error('Erro ao preencher o formulário de edição de produto:', error);
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new ProdutoController();
