const Fornecedor = require('../models/Fornecedor');
const Endereco = require('../models/Endereco');

class FornecedorController {
    async index(req, res) {
        try {
            const fornecedores = await Fornecedor.findAllFornecedores();
            console.log('Fornecedores encontrados:', fornecedores);
            res.json(fornecedores);
        } catch (error) {
            console.error('Erro ao obter a lista de fornecedores:', error);
            res.status(500).json({ error: 'Erro ao obter a lista de fornecedores' });
        }
    }

    async create(req, res) {
        try {
            const { nome, email, telefone, nomeLoja, descricaoLoja } = req.body;

            // Criar o endereço
            const enderecoCreated = await Endereco.create(req.body.endereco); // Supondo que os dados do endereço estejam no corpo da requisição
            const endereco_id = enderecoCreated.id;

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

            const novoFornecedor = await Fornecedor.createFornecedor({
                nome,
                email,
                telefone,
                endereco_id,
                nomeLoja,
                descricaoLoja,
                logoLoja
            });

            res.status(201).json({ message: 'Fornecedor criado com sucesso!', fornecedor: novoFornecedor });
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
            const [updated] = await Fornecedor.update(req.body, {
                where: { id: req.params.id }
            });
            if (!updated) return res.status(404).json({ error: 'Fornecedor não encontrado' });
            
            const fornecedor = await Fornecedor.findById(req.params.id);
            console.log('Fornecedor atualizado:', fornecedor);
            res.status(200).json(fornecedor);
        } catch (err) {
            console.error('Erro ao atualizar fornecedor:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async delete(req, res) {
        try {
            const deleted = await Fornecedor.deleteFornecedor(req.params.id);
            if (!deleted) return res.status(404).json({ error: 'Fornecedor não encontrado' });
            console.log('Fornecedor deletado com sucesso.');
            res.status(204).send();
        } catch (err) {
            console.error('Erro ao deletar fornecedor:', err);
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new FornecedorController();
