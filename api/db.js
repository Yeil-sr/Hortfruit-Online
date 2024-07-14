const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Defina o caminho absoluto para o certificado SSL
const caCertPath = path.resolve(__dirname, './src/etc/ssl/cacert-2024-07-02.pem');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
            ca: fs.readFileSync(caCertPath),
        },
    },
});

// Verificar conexão com o banco de dados
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
    } catch (err) {
        console.error('Não foi possível conectar ao banco de dados:', err);
    }
};

testConnection();

module.exports = sequelize;
