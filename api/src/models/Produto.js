const { db } = require("../../db.js");

class Produto {
    // Método para listar todos os produtos
    static async findAll() {
        return new Promise((resolve, reject) => {
            const q = "SELECT * FROM produto";
            db.query(q, (err, result) => {
                if (err) {
                    console.error('Erro ao obter a lista de produtos:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

  // Método para encontrar a imagem de um produto pelo ID do produto
  static async findImageByProdutoId(produto_id) {
    return new Promise((resolve, reject) => {
        const q = "SELECT img_produto FROM produto WHERE id=?";
        db.query(q, [produto_id], (err, result) => {
            if (err) {
                console.error('Erro ao buscar imagem do produto:', err);
                return reject(err);
            }
            if (result.length === 0) {
                return resolve(null); // Retorna null se a imagem não for encontrada
            }
            resolve(result[0].img_produto); // Retorna o buffer da imagem
        });
    });
}
    
    // // Método para encontrar a imagem de um produto pelo ID do produto e fornecedor_id
    // static async findImageByFornecedor(produto_id, fornecedor_id) {
    //     return new Promise((resolve, reject) => {
    //         const q = "SELECT img_produto FROM produto WHERE id=? AND fornecedor_id=?";
    //         db.query(q, [produto_id, fornecedor_id], (err, result) => {
    //             if (err) {
    //                 console.error('Erro ao buscar imagem do produto:', err);
    //                 return reject(err);
    //             }
    //             if (result.length === 0) {
    //                 return resolve(null); // Retorna null se a imagem não for encontrada
    //             }
    //             resolve(result[0].img_produto); // Retorna o buffer da imagem
    //         });
    //     });
    // }

    static async findByFornecedorId(fornecedor_id) {
        return new Promise((resolve, reject) => {
            const q = "SELECT * FROM produto WHERE fornecedor_id=?";
            db.query(q, [fornecedor_id], (err, result) => {
                if (err) {
                    console.error('Erro ao buscar produtos por fornecedor_id:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    // Método para encontrar um produto pelo ID
    static async findById(id) {
        return new Promise((resolve, reject) => {
            const q = "SELECT * FROM produto WHERE id=?";
            db.query(q, [id], (err, result) => {
                if (err) {
                    console.error('Erro ao encontrar o produto pelo ID:', err);
                    return reject(err);
                }
                if (result.length === 0) {
                    return resolve(null); // Retorna null quando o produto não é encontrado
                }
                const produto = result[0];
                // Construir o objeto com os campos do formulário de edição
                const formularioEdicao = {
                    nome: produto.nome,
                    img_produto: produto.img_produto,
                    tipo: produto.tipo,
                    unidade: produto.unidade,
                    cod: produto.cod,
                    quantidade: produto.quantidade,
                    preco: produto.preco,
                    descricao: produto.descricao,
                    fornecedor_id: produto.fornecedor_id, // Incluir o fornecedor_id
                    id: produto.id // Incluir o ID do produto
                };
                resolve(formularioEdicao);
            });
        });
    }

    // Método para adicionar um novo produto
    static async addProduto({ nome, tipo, unidade, cod, quantidade, preco, descricao, fornecedor_id, img_produto }) {
        return new Promise((resolve, reject) => {
            const q = `
                INSERT INTO produto(nome, tipo, unidade, cod, quantidade, preco, descricao, fornecedor_id, img_produto)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [nome, tipo, unidade, cod, quantidade, preco, descricao, fornecedor_id, img_produto];
            db.query(q, values, (err, result) => {
                if (err) {
                    console.error('Erro ao adicionar o produto:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    // Método para atualizar um produto existente
    static async updateProduto(id, dadosProduto) {
        return new Promise(async (resolve, reject) => {
            try {
                const produtoExistente = await Produto.findById(id);
                if (!produtoExistente) {
                    throw new Error('Produto não encontrado');
                }
                const q = `
                    UPDATE produto 
                    SET nome=?, tipo=?, unidade=?, cod=?, quantidade=?, preco=?, descricao=?, fornecedor_id=?, img_produto=?
                    WHERE id=?
                `;
                const values = [dadosProduto.nome, dadosProduto.tipo, dadosProduto.unidade, dadosProduto.cod, dadosProduto.quantidade, dadosProduto.preco, dadosProduto.descricao, dadosProduto.fornecedor_id, dadosProduto.img_produto, id];
                db.query(q, values, (err, result) => {
                    if (err) {
                        console.error('Erro ao atualizar o produto:', err);
                        return reject(err);
                    }
                    resolve(result);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    // Método para deletar um produto
    static async deleteProduto(id) {
        return new Promise((resolve, reject) => {
            const q = "DELETE FROM produto WHERE id=?";
            db.query(q, [id], (err, result) => {
                if (err) {
                    console.error('Erro ao deletar o produto:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}

module.exports = Produto;
