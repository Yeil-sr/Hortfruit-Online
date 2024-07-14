const Usuario = require('../models/Usuario.js');
const Cliente = require('../models/Cliente.js');
const Fornecedor = require('../models/Fornecedor.js');
const Endereco = require('../models/Endereco.js');
const sequelize = require("../../db.js");

class usuarioController {
    async createUser(req, res) {
        const { nome, email, senha, isFornecedor, telefone, nomeLoja, descricaoLoja, logoLoja, rua, numero, cidade, bairro, estado, cep, complemento, referencia } = req.body;

        if (!nome || !email || !senha || telefone === undefined || isFornecedor === undefined || !rua || !numero || !cidade || !estado || !cep) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        try {
            const existingUser = await Usuario.findOne({ where: { email } });

            if (existingUser) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }

            await sequelize.transaction(async (transaction) => {
                const enderecoCreated = await Endereco.create({
                    rua, numero, cidade, bairro, estado, cep, complemento, referencia
                }, { transaction });

                const enderecoId = enderecoCreated.id;

                // Criar o usuário
                const usuario = await Usuario.createUser({ nome, email, senha, isFornecedor }, { transaction });
                const usuarioId = usuario.id;

                // Criar o fornecedor ou cliente
                if (isFornecedor) {
                    const fornecedorData = {
                        usuario_id: usuarioId,
                        nome,
                        email,
                        telefone,
                        endereco_id: enderecoId,
                        nomeLoja,
                        descricaoLoja,
                        logoLoja: logoLoja ? Buffer.from(logoLoja) : null
                    };
                    await Fornecedor.create(fornecedorData, { transaction });
                } else {
                    const clienteData = {
                        usuario_id: usuarioId,
                        telefone,
                        endereco_id: enderecoId,
                        nome,
                        email
                    };
                    await Cliente.create(clienteData, { transaction });
                }
            });

            res.status(201).json({ message: 'Usuário criado com sucesso!' });
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({ error: 'Erro ao criar usuário' });
        }
    }

    async authenticate(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        try {
            console.log('Tentativa de autenticação para o email:', email);
            const usuario = await Usuario.authenticate(email, senha);
            if (!usuario) {
                console.log('Autenticação falhou para o email:', email);
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            req.session.user = { id: usuario.id, isFornecedor: usuario.isFornecedor, nome: usuario.nome, email: usuario.email };
            res.json(req.session.user); // Retorna as informações do usuário autenticado
        } catch (error) {
            console.error('Erro ao autenticar usuário:', error);
            res.status(500).json({ error: 'Erro ao autenticar usuário' });
        }
    }

    async getUser(req, res) {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        const userId = req.session.user.id;

        try {
            const usuario = await Usuario.findByPk(userId);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const userResponse = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                isFornecedor: usuario.isFornecedor
            };

            if (usuario.isFornecedor) {
                const fornecedor = await Fornecedor.findByUsuarioId(usuario.id);
                if (fornecedor) {
                    userResponse.fornecedor_id = fornecedor.id;
                }
            }

            res.json(userResponse);
        } catch (error) {
            console.error('Erro ao buscar informações do usuário:', error);
            res.status(500).json({ error: 'Erro ao buscar informações do usuário' });
        }
    }

    async getUserById(req, res) {
        const userId = req.params.id;

        try {
            const usuario = await Usuario.findByPk(userId);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const userResponse = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                isFornecedor: usuario.isFornecedor
            };

            if (usuario.isFornecedor) {
                const fornecedor = await Fornecedor.findOne({ where: { usuario_id: userId } });
                if (fornecedor) {
                    userResponse.fornecedor_id = fornecedor.id;
                }
            }

            res.json(userResponse);
        } catch (error) {
            console.error('Erro ao buscar informações do usuário:', error);
            res.status(500).json({ error: 'Erro ao buscar informações do usuário' });
        }
    }

    async getUserByEmail(req, res) {
        const userEmail = req.params.email;

        try {
            const usuario = await Usuario.findOne({ where: { email: userEmail } });
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const userResponse = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                isFornecedor: usuario.isFornecedor
            };

            if (usuario.isFornecedor) {
                const fornecedor = await Fornecedor.findOne({ where: { usuario_id: usuario.id } });
                if (fornecedor) {
                    userResponse.fornecedor_id = fornecedor.id;
                }
            }

            res.json(userResponse);
        } catch (error) {
            console.error('Erro ao buscar informações do usuário por email:', error);
            res.status(500).json({ error: 'Erro ao buscar informações do usuário por email' });
        }
    }    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao fazer logout' });
            }
            res.clearCookie('session_cookie_name');
            res.json({ message: 'Logout realizado com sucesso' });
        });
    }

    async initiatePasswordReset(req, res) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email é obrigatório' });
        }

        try {
            const { token } = await Usuario.initiatePasswordReset(email);
            res.json({ message: 'Instruções de recuperação de senha enviadas para o email' });
        } catch (error) {
            console.error('Erro ao iniciar recuperação de senha:', error);
            res.status(500).json({ error: 'Erro ao iniciar recuperação de senha' });
        }
    }

    async resetPassword(req, res) {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
        }

        try {
            await Usuario.resetPassword(token, newPassword);
            res.json({ message: 'Senha redefinida com sucesso!' });
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            res.status(500).json({ error: 'Erro ao redefinir senha' });
        }
    }

}

module.exports = new usuarioController();
