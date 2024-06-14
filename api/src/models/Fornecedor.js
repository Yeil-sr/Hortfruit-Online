const { db } = require("../../db.js");

class Fornecedor {

    static async findAll() {
        return new Promise((resolve, reject) => {
            const q = "SELECT * FROM fornecedor";
            db.query(q, (err, result) => {
                if (err) {
                    console.error('Erro ao obter a lista de fornecedores:', err);
                    return reject(err);
                }
                console.log('Fornecedores encontrados:', result); 
                resolve(result);
            });
        });
    }

    static async findByUsuarioId(usuario_id) {
        return new Promise((resolve, reject)=>{
            const query = 'SELECT * FROM fornecedor WHERE usuario_id = ?'; 
            console.log('ID fornecido:', usuario_id); 
            db.query(query, [usuario_id], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
                console.log('Parâmetros da consulta:', [usuario_id]); 
                console.log('Resultado da consulta:', result); 
            });
        })
  
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM fornecedor WHERE id = ?";
            console.log('ID fornecido:', id); 
            db.query(query, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
                console.log('Parâmetros da consulta:', [id]); 
                console.log('Resultado da consulta:', result); 
            });
        });
    }

    static async create({ nome, email, telefone, endereco_id, nomeLoja, descricaoLoja, logoLoja }) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO fornecedor 
                (nome, email, telefone, endereco_id, nomeLoja, descricaoLoja, logoLoja)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            db.query(query, [nome, email, telefone, endereco_id, nomeLoja, descricaoLoja, logoLoja], (err, result) => {
                console.log(this.sql);
                if (err) {
                    console.error('Erro ao criar fornecedor:', err);
                    return reject(err);
                }
                resolve(result);
            });
        }); 
    }
    
    
    
    static async delete(id) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM fornecedor WHERE id = ?";
            db.query(query, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = Fornecedor;
