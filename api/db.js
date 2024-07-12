const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

// Defina o caminho absoluto para o certificado SSL
const caCertPath = path.resolve(__dirname, './src/etc/ssl/cacert-2024-07-02.pem');

const sslOptions = {
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(caCertPath)
    }
};

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: sslOptions.ssl
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados');
});

module.exports = { db };
