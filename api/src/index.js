require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const upload = require('./multerConfig/multerConfig.js');
const { MercadoPagoConfig } = require('mercadopago');
const sequelize = require('../db.js'); // Importar a instância do Sequelize

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    options: { timeout: 5000, idempotencyKey: 'abc' },
});

const app = express();
const porta = process.env.PORT || 8080;

// Middleware para servir arquivos estáticos
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

const publicDir = path.join(__dirname, 'public');
app.use('/public', express.static(publicDir));

// Configuração do armazenamento da sessão no MySQL
const sessionStore = new SequelizeStore({
    db: sequelize,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Configuração de sessões
app.use(session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
    }
}));

// Sincronizar a tabela de sessões
sessionStore.sync();

// Configuração de rotas e outros middlewares
const views = path.join(__dirname, 'views');
app.use(express.static(views));

const clienteRoutes = require('./routes/clienteRoutes.js');
const fornecedorRoutes = require('./routes/fornecedorRoutes.js');
const produtoRoutes = require('./routes/produtoRoutes.js');
const enderecoRoutes = require('./routes/enderecoRoutes.js');
const pedidoRoutes = require('./routes/pedidoRoutes.js');
const pagamentoRoutes = require('./routes/pagamentoRoutes.js');
const usuarioRoutes = require('./routes/usuarioRoutes.js');
const carrinhoRoutes = require('./routes/carrinhoRoutes.js');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './views/catalogo.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, './views/cadastro.html'));
});

app.get('/carrinho', (req, res) => {
    res.sendFile(path.join(__dirname, './views/carrinho.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './views/login.html'));
});

app.get('/confirmarcadastro', (req, res) => {
    res.sendFile(path.join(__dirname, './views/confirmarcadastro.html'));
});

app.get('/pedido/sucesso', (req, res) => {
    res.sendFile(path.join(__dirname, './views/fechamento_pedido.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use('/produto', produtoRoutes);
app.use('/cliente', clienteRoutes);
app.use('/fornecedor', fornecedorRoutes);
app.use('/endereco', enderecoRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/pedido', pedidoRoutes);
app.use('/pagamento', pagamentoRoutes);
app.use('/usuario', usuarioRoutes);

app.listen(porta, () => {
    console.log("Server running on port", porta);
});

module.exports = app;
