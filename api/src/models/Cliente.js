const { db } = require("../../db.js");

class Cliente {
    static async findAll() {
        return new Promise((resolve, reject) => {
            const q = "SELECT * FROM cliente";
            db.query(q, (err, result) => {
                if (err) {
                    console.error('Erro ao obter a lista de clientes', err);
                    return reject(err);
                }
                console.log('clientes encontrados:', result); 
                resolve(result);
            });
        });
    }

    static async create({ nome, email, telefone, endereco_id }) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO cliente (nome, email, telefone, endereco_id)
                VALUES (?, ?, ?, ?)
            `;
            db.query(query, [nome, email, telefone, endereco_id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    


    static async findById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM cliente WHERE id = ?";
            db.query(query, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });
    }

    static async update(id, { nome, email, telefone, endereco_id }) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE cliente SET nome = ?, email = ?, telefone = ?, endereco_id = ?
                WHERE id = ?
            `;
            db.query(query, [nome, email, telefone, endereco_id, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM cliente WHERE id = ?";
            db.query(query, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = Cliente;
