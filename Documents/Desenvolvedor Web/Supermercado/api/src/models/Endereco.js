const { db } = require("../../db.js");

class Endereco {
    static async create({ rua, numero, cidade, bairro, estado, cep, complemento, referencia }) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO endereco (rua, numero, cidade, bairro, estado, cep, complemento, referencia)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.query(query, [rua, numero, cidade, bairro, estado, cep, complemento, referencia], (err, result) => {
                if (err) return reject(err);
                resolve({ id: result.insertId }); // Return the ID of the newly inserted address
            });
        });
    }

    static async findByData(rua, numero, cidade, estado, cep) {
        const query = "SELECT * FROM endereco WHERE rua = ? AND numero = ? AND cidade = ? AND estado = ? AND cep = ?";
        return new Promise((resolve, reject) => {
            db.query(query, [rua, numero, cidade, estado, cep], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });
    }
    static async update(id, { rua, numero, cidade, estado, cep, complemento, referencia }) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE endereco 
                SET rua = ?, numero = ?, cidade = ?, estado = ?, cep = ?, complemento = ?, referencia = ?
                WHERE id = ?
            `;
            db.query(query, [rua, numero, cidade, estado, cep, complemento, referencia, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    

    static async delete(id) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM endereco WHERE id = ?";
            db.query(query, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = Endereco;
