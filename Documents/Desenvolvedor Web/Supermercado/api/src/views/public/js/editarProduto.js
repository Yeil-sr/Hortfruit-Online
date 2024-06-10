
async function editarProduto(id) {
    try {
        const response = await fetch(`/produto/editar/${id}`);
        const produto = await response.json();

        document.getElementById('nome').value = produto.nome;
        document.getElementById('tipo').value = produto.tipo;
        document.getElementById('unidade').value = produto.unidade;
        document.getElementById('cod').value = produto.cod;
        document.getElementById('quantidade').value = produto.quantidade;
        document.getElementById('preco').value = produto.preco;
        document.getElementById('descricao').value = produto.descricao;
        document.getElementById('fornecedor_id').value = produto.fornecedor_id; 

        const editarProdutoModal = new bootstrap.Modal(document.getElementById('editarProdutoModal'));
        editarProdutoModal.show();
    } catch (error) {
        console.error('Erro ao preencher o formulário de edição de produto:', error);
        alert('Erro ao preencher o formulário de edição de produto');
    }
}

async function enviarDadosFormulario() {
    try {
        const form = document.getElementById('editarProdutoForm');
        const id = form.getAttribute('data-id');
        
        const nome = document.getElementById('nome').value;
        const tipo = document.getElementById('tipo').value;
        const unidade = document.getElementById('unidade').value;
        const cod = document.getElementById('cod').value;
        const quantidade = document.getElementById('quantidade').value;
        const preco = document.getElementById('preco').value;
        const descricao = document.getElementById('descricao').value;
        const fornecedor_id = document.getElementById('fornecedor_id').value; 

        const dadosProduto = { nome, tipo, unidade, cod, quantidade, preco, descricao, fornecedor_id };

        const putResponse = await fetch(`/produto/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosProduto)
        });

        if (!putResponse.ok) {
            throw new Error('Erro ao atualizar o produto');
        }

        alert('Produto atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar o produto:', error);
        alert('Erro ao atualizar o produto');
    }
}

    async function excluirProduto(fornecedor_id) {
        if (confirm('Deseja realmente excluir este produto?')) {
            try {
                const response = await fetch(`/produto/fornecedor/${fornecedor_id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error('Erro ao excluir o produto');
                }
                alert('Produto excluído com sucesso!');
                construirTabelaProdutos();
            } catch (error) {
                console.error('Erro ao excluir o produto:', error);
                alert('Erro ao excluir o produto');
            }
        }
    }
    async function obterListaProdutos(fornecedor_id) {
        try {
            const response = await fetch(`/produto/fornecedor/${fornecedor_id}`); 
            if (!response.ok) {
                throw new Error('Erro ao obter a lista de produtos');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao obter a lista de produtos:', error);
            throw error; 
        }
    }
    async function construirTabelaProdutos() {
        const produtosContainer = document.getElementById('produtosContainer');
        produtosContainer.innerHTML = ''; // Limpa o conteúdo atual

        try {
            // Obtendo a lista de produtos
            const produtos = await obterListaProdutos();

            // Criando a tabela HTML
            const tabela = document.createElement('table');
            tabela.classList.add('table', 'table-striped'); 
            tabela.innerHTML = `
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Unidade</th>
                        <th>Código</th>
                        <th>Quantidade</th>
                        <th>Preço</th>
                        <th>Descrição</th>
                        <th>Ações</th> <!-- Coluna para os botões de editar e deletar -->
                    </tr>
                </thead>
                <tbody></tbody>
            `;

            // Adicionando cada produto como uma linha na tabela
            const tbody = tabela.querySelector('tbody');
            produtos.forEach(produto => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${produto.nome}</td>
                    <td>${produto.tipo}</td>
                    <td>${produto.unidade}</td>
                    <td>${produto.cod}</td>
                    <td>${produto.quantidade}</td>
                    <td>${produto.preco}</td>
                    <td>${produto.descricao}</td>
                    <td>
<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editarProdutoModal" onclick="editarProduto(${produto.id})">Editar</button>
                        <button type="button" class="btn btn-danger btn-sm" onclick="excluirProduto(${produto.id})">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Adicionando a tabela ao container
            produtosContainer.appendChild(tabela);
        } catch (error) {
            // Em caso de erro, exibe uma mensagem de erro
            console.error('Erro ao construir a tabela de produtos:', error);
            produtosContainer.innerHTML = '<p>Erro ao carregar a lista de produtos</p>';
        }
    }

    
    // Chamar a função para construir a tabela de produtos ao carregar a página
    window.onload = construirTabelaProdutos;
