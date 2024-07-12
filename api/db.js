const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const sslOptions = {
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.resolve(__dirname, process.env.CA_CERT_PATH))
    }
};

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: sslOptions.ssl // Use sslOptions.ssl diretamente
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados');
});

module.exports = { db };
