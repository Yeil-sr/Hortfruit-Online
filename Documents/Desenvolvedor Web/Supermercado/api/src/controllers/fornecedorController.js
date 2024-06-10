const Fornecedor = require('../models/Fornecedor');
const Endereco = require('../models/Endereco');
const { db } = require("../../db.js");

class fornecedorController {
    async index(req, res) {
        try {
            const fornecedores = await Fornecedor.findAll();
            console.log('Fornecedores encontrados:', fornecedores);
            res.json(fornecedores);
        } catch (error) {
            console.error('Erro ao obter a lista de fornecedores:', error);
            res.status(500).json({ error: 'Erro ao obter a lista de fornecedores' });
        }
    }

    async create(req, res) {
        try {
            const { nome, email, telefone, nomeLoja, descricaoLoja} = req.body;
             // Criar o endereço
            const enderecoCreated = await Endereco.create;
             const endereco_id = enderecoCreated.insertId;
            // Verificar se o ID do endereço foi fornecido
            if (!endereco_id) {
                return res.status(400).json({ error: 'O ID do endereço é obrigatório' });
            }

            // Verificar se o endereço existe no banco de dados
            const enderecoExists = await Endereco.findById(endereco_id);
            if (!enderecoExists) {
                return res.status(404).json({ error: 'Endereço não encontrado' });
            }

            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: 'Nenhum arquivo de imagem enviado' });
            }

            const logoLoja = file.path;

            await Fornecedor.create({ nome, email, telefone, endereco_id, nomeLoja, descricaoLoja, logoLoja });

            res.status(201).json({ message: 'Fornecedor criado com sucesso!' });
        } catch (error) {
            console.error('Erro ao criar fornecedor:', error);
            res.status(500).json({ error: 'Erro ao criar fornecedor' });
        }
    }

    async findById(req, res) {
        try {
            const fornecedor = await Fornecedor.findById(req.params.id);
            if (!fornecedor) return res.status(404).json({ error: 'Fornecedor não encontrado' });
            console.log('Fornecedor encontrado:', fornecedor);
            res.status(200).json(fornecedor);
        } catch (err) {
            console.error('Erro ao buscar fornecedor por ID:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async update(req, res) {
        try {
            const fornecedor = await Fornecedor.update(req.params.id, req.body);
            if (!fornecedor) return res.status(404).json({ error: 'Fornecedor não encontrado' });
            console.log('Fornecedor atualizado:', fornecedor);
            res.status(200).json(fornecedor);
        } catch (err) {
            console.error('Erro ao atualizar fornecedor:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            await Fornecedor.delete(req.params.id);
            console.log('Fornecedor deletado com sucesso.');
            res.status(204).send();
        } catch (err) {
            console.error('Erro ao deletar fornecedor:', err);
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new fornecedorController();
