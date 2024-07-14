const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sequelize = require('../../db.js'); 

class Usuario extends Model {
    async comparePassword(senha) {
        return bcrypt.compare(senha, this.senha);
    }
}

Usuario.init({
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isFornecedor: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: false // Se você não estiver usando os timestamps padrão (createdAt, updatedAt)
});

// Métodos estáticos
Usuario.createUser = async function({ nome, email, senha, isFornecedor }) {
    const hashedPassword = await bcrypt.hash(senha, 10);
    return Usuario.create({ nome, email, senha: hashedPassword, isFornecedor });
};

Usuario.findById = async function(userId) {
    const usuario = await Usuario.findByPk(userId, {
        attributes: ['id', 'nome', 'email', 'isFornecedor']
    });
    return usuario ? usuario.toJSON() : null;
};

Usuario.findByEmail = async function(email) {
    const usuario = await Usuario.findOne({
        where: { email },
        attributes: ['id', 'nome', 'email', 'isFornecedor']
    });
    return usuario ? usuario.toJSON() : null;
};

Usuario.authenticate = async function(email, senha) {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
        console.log('Usuário não encontrado para o email:', email);
        return null;
    }

    const isPasswordValid = await usuario.comparePassword(senha);
    if (isPasswordValid) {
        console.log('Senha válida para o usuário:', email);
        return usuario.toJSON();
    } else {
        console.log('Senha inválida para o usuário:', email);
        return null;
    }
};

Usuario.initiatePasswordReset = async function(email) {
    const token = crypto.randomBytes(20).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour from now
    const [updated] = await Usuario.update(
        { resetToken: token, resetTokenExpiry: expiry },
        { where: { email } }
    );

    if (updated) {
        return { token, email };
    } else {
        throw new Error('Erro ao iniciar recuperação de senha');
    }
};

Usuario.resetPassword = async function(token, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [updated] = await Usuario.update(
        { senha: hashedPassword, resetToken: null, resetTokenExpiry: null },
        { where: { resetToken: token, resetTokenExpiry: { [Sequelize.Op.gt]: Date.now() } } }
    );

    if (updated) {
        return true;
    } else {
        throw new Error('Token inválido ou expirado');
    }
};

module.exports = Usuario;
