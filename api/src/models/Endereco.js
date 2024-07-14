const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../../db.js'); 

class Endereco extends Model {}

Endereco.init({

    rua: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cidade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bairro: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cep: {
        type: DataTypes.STRING,
        allowNull: false
    },
    complemento: {
        type: DataTypes.STRING,
        allowNull: true
    },
    referencia: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Endereco',
    tableName: 'endereco', // Nome da tabela no banco de dados
    timestamps: false // Se não estiver usando campos de timestamps (createdAt, updatedAt)
});

module.exports = Endereco;
