const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../db');
const Fornecedor = require('./Fornecedor.js');

class Produto {
    // Define the model only once
    static init() {
        return sequelize.define('Produto', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            tipo: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            unidade: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            cod: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            quantidade: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            preco: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            descricao: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            fornecedor_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            img_produto: {
                type: DataTypes.BLOB, // Use BLOB or MEDIUMBLOB for image storage
                allowNull: true,
            }
        }, {
            tableName: 'produto',
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        });
    }

    // Call init once to define the model
    static model = Produto.init();

    // Define your static methods using this model
    static async findAll() {
        return await this.model.findAll();
    }

    static async findByFornecedorId(fornecedor_id) {
        return await this.model.findAll({ where: { fornecedor_id } });
    }

    static async findImageByProdutoId(produto_id) {
        const produto = await this.model.findByPk(produto_id);
        return produto ? produto.img_produto : null;
    }

    static async findById(id) {
        return await this.model.findByPk(id);
    }

    static async addProduto(data) {
        return await this.model.create(data);
    }

    static async updateProduto(id, dadosProduto) {
        const produto = await this.findById(id);
        if (!produto) {
            throw new Error('Produto não encontrado');
        }
        return await produto.update(dadosProduto);
    }

    static async deleteProduto(id) {
        const produto = await this.findById(id);
        if (!produto) {
            throw new Error('Produto não encontrado');
        }
        return await produto.destroy();
    }
}

module.exports = Produto;
