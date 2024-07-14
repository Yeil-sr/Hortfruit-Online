const Endereco = require('../models/Endereco');

class enderecoController {
    async create(req, res) {
        try {
            const { rua, numero, cidade, bairro, estado, cep, complemento, referencia } = req.body;

            if (!rua || !numero || !cidade || !estado || !cep) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            const existingAddress = await Endereco.findOne({ where: { rua, numero, cidade, estado, cep } });
            if (existingAddress) {
                return res.status(400).json({ error: 'Endereço já existe' });
            }

            const endereco = await Endereco.create({ rua, numero, cidade, bairro, estado, cep, complemento, referencia });
            res.status(201).json({ success: true, id: endereco.id });
        } catch (err) {
            console.error('Erro ao criar endereço:', err);
            res.status(500).json({ error: 'Erro ao criar endereço' });
        }
    }

    async findById(req, res) {
        try {
            const { id } = req.params;
            const endereco = await Endereco.findByPk(id);

            if (!endereco) {
                return res.status(404).json({ error: 'Endereço não encontrado' });
            }

            res.status(200).json(endereco);
        } catch (err) {
            console.error('Erro ao buscar endereço:', err);
            res.status(500).json({ error: 'Erro ao buscar endereço' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { rua, numero, cidade, estado, cep, complemento, referencia } = req.body;

            if (!rua || !numero || !cidade || !estado || !cep) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            const [updatedRows] = await Endereco.update(
                { rua, numero, cidade, estado, cep, complemento, referencia },
                { where: { id } }
            );

            if (updatedRows === 0) {
                return res.status(404).json({ error: 'Endereço não encontrado ou nenhum dado foi alterado' });
            }

            res.status(200).json({ message: 'Endereço atualizado com sucesso!' });
        } catch (err) {
            console.error('Erro ao atualizar endereço:', err);
            res.status(500).json({ error: 'Erro ao atualizar endereço' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedRows = await Endereco.destroy({ where: { id } });

            if (deletedRows === 0) {
                return res.status(404).json({ error: 'Endereço não encontrado' });
            }

            res.status(200).json({ message: 'Endereço deletado com sucesso!' });
        } catch (err) {
            console.error('Erro ao deletar endereço:', err);
            res.status(500).json({ error: 'Erro ao deletar endereço' });
        }
    }

    async editarEndereco(req, res) {
        try {
            const { id } = req.params;
            console.log('ID recebido no controlador:', id);

            const endereco = await Endereco.findByPk(id);
            if (!endereco) {
                return res.status(404).json({ error: 'Endereço não encontrado' });
            }

            res.json(endereco);
        } catch (err) {
            console.error('Erro ao preencher o formulário de edição de endereço:', err);
            res.status(404).json({ error: 'Erro ao preencher o formulário de edição de endereço' });
        }
    }
}

module.exports = new enderecoController();
