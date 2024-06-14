const { db } = require("../../db.js");
const Endereco = require('../models/Endereco');
const Cliente = require('../models/Cliente');

class clienteController {
    async index(req, res) {
        try {
            const clientes = await Cliente.findAll();
            res.json(clientes);
        } catch (error) {
            console.error('Erro ao obter a lista de clientes:', error);
            res.status(500).json({ error: 'Erro ao obter a lista de clientes' });
        }
    }

    async create(req, res) {
        try {
            const { nome, email, telefone, endereco } = req.body;

            // Criar o endereço primeiro
            const enderecoData = await Endereco.create;
            const enderecoId = enderecoData.id;


            // Criar o cliente
            const cliente = await Cliente.create;
            res.status(201).json({ success: true, id: cliente.insertId });
        } catch (err) {
            console.error('Erro ao criar cliente:', err);
            res.status(500).json({ error: err.message });
        }
    }

     async findById(req, res) {
        try {
            const cliente = await Cliente.findById(req.params.id);
            if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
            res.status(200).json(cliente);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

     async update(req, res) {
        try {
            const cliente = await Cliente.update(req.params.id, req.body);
            if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
            res.status(200).json(cliente);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

     async delete(req, res) {
        try {
            await Cliente.delete(req.params.id);
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new clienteController();
