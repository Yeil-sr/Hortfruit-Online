const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../db'); // Assumindo que a instância do Sequelize está configurada corretamente

class Pagamento extends Sequelize.Model {
    // Métodos estáticos
    static async processarPagamento({ tipo, metodo, parceladas, cartao, boleto }) {
        try {
            let transaction;

            // Iniciar uma transação se houver pagamento por cartão
            if (tipo === 'cartao') {
                transaction = await sequelize.transaction();
            }

            const pagamento = await Pagamento.create({
                tipo,
                metodo,
                parceladas,
                titular: cartao ? cartao.titular : null,
                num_cartao: cartao ? cartao.numCartao : null,
                data_expiracao: cartao ? cartao.dataExpiracao : null,
                codigo_seguranca: cartao ? cartao.cvv : null,
                data_vencimento: boleto ? boleto.dataVencimento : null,
                instrucoes: boleto ? JSON.stringify(boleto.instrucoes) : null
            }, { transaction });

            // Commit da transação se existir
            if (transaction) {
                await transaction.commit();
            }

            return pagamento.id; // Retorna o ID do pagamento inserido
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    static async cancelarPagamento(pagamentoId) {
        try {
            const pagamento = await Pagamento.findByPk(pagamentoId);
            if (!pagamento) {
                throw new Error(`Pagamento com ID ${pagamentoId} não encontrado.`);
            }

            pagamento.status = 'cancelado';
            await pagamento.save();

            return pagamento;
        } catch (error) {
            throw error;
        }
    }
}

// Definição do modelo Pagamento
Pagamento.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    metodo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parceladas: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    titular: {
        type: DataTypes.STRING,
        allowNull: true
    },
    num_cartao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    data_expiracao: {
        type: DataTypes.DATE,
        allowNull: true
    },
    codigo_seguranca: {
        type: DataTypes.STRING,
        allowNull: true
    },
    data_pagamento: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    data_vencimento: {
        type: DataTypes.DATE,
        allowNull: true
    },
    instrucoes: {
        type: DataTypes.JSON,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pendente' // Ou outro valor padrão desejado
    }
}, {
    sequelize,
    modelName: 'Pagamento',
    tableName: 'pagamento',
    timestamps: false // Se não houver colunas de timestamps (created_at, updated_at)
});

module.exports = Pagamento;
