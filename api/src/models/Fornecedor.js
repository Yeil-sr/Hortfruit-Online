const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../db'); // Assuming sequelize instance is properly configured and imported

const Fornecedor = sequelize.define('Fornecedor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endereco_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nomeLoja: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricaoLoja: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    logoLoja: {
        type: DataTypes.BLOB,
        allowNull: true
    }
}, {
    tableName: 'fornecedor',
    timestamps: false
});

// Métodos do Modelo

//Associate Fornecedor with Usuario and Endereco models
Fornecedor.associate = (models) => {
    Fornecedor.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
    });
    Fornecedor.belongsTo(models.Endereco, {
        foreignKey: 'endereco_id',
        as: 'endereco'
    });
}

// Encontrar todos os fornecedores
Fornecedor.findAllFornecedores = async () => {
    try {
        const fornecedores = await Fornecedor.findAll();
        return fornecedores;
    } catch (err) {
        console.error('Erro ao buscar todos os fornecedores:', err);
        throw err;
    }
};

// Encontrar fornecedor pelo ID do usuário
Fornecedor.findByUsuarioId = async (usuario_id) => {
    try {
        const fornecedor = await Fornecedor.findOne({ where: { usuario_id } });
        return fornecedor;
    } catch (err) {
        console.error(`Erro ao buscar fornecedor pelo ID do usuário ${usuario_id}:`, err);
        throw err;
    }
};

// Encontrar fornecedor pelo ID
Fornecedor.findById = async (id) => {
    try {
        const fornecedor = await Fornecedor.findByPk(id);
        return fornecedor;
    } catch (err) {
        console.error(`Erro ao buscar fornecedor pelo ID ${id}:`, err);
        throw err;
    }
};

// Criar um novo fornecedor
Fornecedor.createFornecedor = async ({ nome, email, telefone, endereco_id, usuario_id, nomeLoja, descricaoLoja, logoLoja }) => {
    try {
        const novoFornecedor = await Fornecedor.create({
            nome,
            email,
            telefone,
            endereco_id,
            usuario_id,
            nomeLoja,
            descricaoLoja,
            logoLoja
        });
        return novoFornecedor;
    } catch (err) {
        console.error('Erro ao criar fornecedor:', err);
        throw err;
    }
};

// Deletar um fornecedor pelo ID
Fornecedor.deleteFornecedor = async (id) => {
    try {
        const deleted = await Fornecedor.destroy({ where: { id } });
        return deleted;
    } catch (err) {
        console.error(`Erro ao deletar fornecedor pelo ID ${id}:`, err);
        throw err;
    }
};

module.exports = Fornecedor;
