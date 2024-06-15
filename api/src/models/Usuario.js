const { db } = require("../../db.js");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class Usuario {
    static async createUser({ nome, email, senha, isFornecedor }) {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const query = "INSERT INTO usuarios (nome, email, senha, isFornecedor) VALUES (?, ?, ?, ?)";
        return new Promise((resolve, reject) => {
            db.query(query, [nome, email, hashedPassword, isFornecedor], (err, result) => {
                if (err) {
                    console.error('Erro ao criar usuário:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static async findById(userId) {
        return new Promise((resolve, reject) => {
            const q = "SELECT * FROM usuarios WHERE id=?";
            db.query(q, [userId], (err, result) => {
                if (err) {
                    console.error('Erro ao encontrar o usuario pelo ID:', err);
                    return reject(err);
                }
                if (result.length === 0) {
                    return resolve(null); 
                }
                const usuario = result[0];
                const userResponse = {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    isFornecedor: usuario.isFornecedor
                };
                resolve(userResponse);
            });
        });
    }


    static async authenticate(email) {
        const query = "SELECT * FROM usuarios WHERE email = ?";
        return new Promise((resolve, reject) => {
            db.query(query, [email], async (err, results) => {
                if (err) {
                    console.error('Erro ao buscar usuário:', err);
                    return reject(err);
                }
                if (results.length === 0) {
                    console.log('Usuário não encontrado para o email:', email);
                    return resolve(null); // Usuário não encontrado
                }

                const usuario = results[0];
                console.log('Usuário encontrado:', usuario);

                const isPasswordValid = await bcrypt.compare;
                if (isPasswordValid) {
                    console.log('Senha válida para o usuário:', email);
                    resolve(usuario); // Senha válida, retorna o usuário
                } else {
                    console.log('Senha inválida para o usuário:', email);
                    resolve(null); // Senha inválida, retorna null
                }
            });
        });
    }

    static async initiatePasswordReset(email) {
        const token = crypto.randomBytes(20).toString('hex');
        const query = "UPDATE usuarios SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?";
        const expiry = Date.now() + 3600000; // 1 hour from now
        return new Promise((resolve, reject) => {
            db.query(query, [token, expiry, email], (err, result) => {
                if (err) {
                    console.error('Erro ao iniciar recuperação de senha:', err);
                    return reject(err);
                }
                resolve({ token, email });
            });
        });
    }

    static async resetPassword(token, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const query = "UPDATE usuarios SET senha = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE resetToken = ? AND resetTokenExpiry > ?";
        return new Promise((resolve, reject) => {
            db.query(query, [hashedPassword, token, Date.now()], (err, result) => {
                if (err) {
                    console.error('Erro ao redefinir senha:', err);
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return reject(new Error('Token inválido ou expirado'));
                }
                resolve(result);
            });
        });
    }
}

module.exports = Usuario;
