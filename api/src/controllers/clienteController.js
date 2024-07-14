const { Cliente } = require('../models/Cliente'); // Importar o modelo Cliente
const Endereco = require('../models/Endereco');

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
            const enderecoData = await Endereco.create(endereco);
            const enderecoId = enderecoData.id;

            // Criar o cliente
            const cliente = await Cliente.create({ nome, email, telefone, endereco_id: enderecoId });
            res.status(201).json({ success: true, id: cliente.id });
        } catch (err) {
            console.error('Erro ao criar cliente:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async findById(req, res) {
        try {
            const cliente = await Cliente.findByPk(req.params.id);
            if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
            res.status(200).json(cliente);
        } catch (err) {
            console.error('Erro ao encontrar cliente pelo ID:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async update(req, res) {
        try {
            const { nome, email, telefone, endereco_id } = req.body;
            const [updated] = await Cliente.update(
                { nome, email, telefone, endereco_id },
                { where: { id: req.params.id } }
            );
            if (!updated) return res.status(404).json({ error: 'Cliente não encontrado' });
            res.status(200).json({ success: true });
        } catch (err) {
            console.error('Erro ao atualizar cliente:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await Cliente.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ error: 'Cliente não encontrado' });
            res.status(204).send();
        } catch (err) {
            console.error('Erro ao deletar cliente:', err);
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new clienteController();
