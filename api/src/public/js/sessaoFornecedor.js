document.addEventListener("DOMContentLoaded", function() {
    // Função para carregar partials
    function loadPartial(partial) {
        fetch(`/fornecedor/partials/fornecedor${partial}`)
            .then(response => response.text())
            .then(html => {
                document.getElementById('content').innerHTML = html;
                updateUserInfo();
            })
            .catch(error => console.error('Erro ao carregar o partial:', error));
    }

    // Carregar dados do usuário
    function updateUserInfo() {
        fetch('/usuario/user')
            .then(response => response.json())
            .then(user => {
                if (user && user.nome && user.isFornecedor) {
                    document.getElementById('user-link').textContent = user.nome;
                    document.getElementById('user-link').href = '#';
                    document.getElementById('auth-link').textContent = 'Sair';
                    document.getElementById('auth-link').href = '#';
                    document.getElementById('auth-link').addEventListener('click', function() {
                        fetch('/usuario/logout', { method: 'POST' })
                            .then(response => {
                                if (response.ok) {
                                    window.location.href = '/login';
                                } else {
                                    alert('Erro ao fazer logout');
                                }
                            });
                           
                    });

                    // Carregar a lista de produtos do fornecedor usando fornecedor_id
                    construirTabelaProdutos();
                }
            })
            .catch(error => console.error('Erro ao buscar informações do usuário:', error));
    }



    // Adiciona evento de clique nos links da lista
    document.querySelectorAll('.list-group-item-action').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = event.currentTarget.getAttribute('data-target');
            loadPartial(target);
        });
    });

    // Carregar a página de dados pessoais por padrão
    loadPartial('fornecedor_painel.html');
});


// Função para obter a lista de produtos
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


async function obterImagemProduto(produto_id) {
    try {
        const response = await fetch(`/produto/imagem/produto/${produto_id}`);
        if (!response.ok) {
            if (response.status === 404) {
                // Se a imagem não for encontrada, retornar um caminho para uma imagem padrão
                return './public/img/default-image.jpg';
            }
            throw new Error('Erro ao obter a imagem do produto');
        }
        const { url } = await response.json(); // Recebe a URL assinada da imagem do produto
        return url; // Retorna a URL assinada da imagem do produto
    } catch (error) {
        console.error('Erro ao obter a imagem do produto:', error);
        // Retornar um caminho para uma imagem padrão em caso de erro
        return './public/img/default-image.jpg';
    }
}

async function construirTabelaProdutos(fornecedor_id) {
    const produtosContainer = document.getElementById('produtosContainer');
    if (!produtosContainer) {
        console.error('Element with ID produtosContainer not found.');
        return; // Exit if the element does not exist
    }
    produtosContainer.innerHTML = ''; // Clear current content

    try {
        const produtos = await obterListaProdutos(fornecedor_id);

        const tabela = document.createElement('table');
        tabela.classList.add('table', 'table-striped', 'table-responsive');
        tabela.innerHTML = `
            <thead>
                <tr>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Unidade</th>
                    <th>Código</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = tabela.querySelector('tbody');
        for (const produto of produtos) {
            const tr = document.createElement('tr');
            const imgSrc = await obterImagemProduto(produto.id);
            tr.innerHTML = `
                <td><img src="${imgSrc}" alt="Imagem do Produto" style="width: 64px; height: 64px;"></td>
                <td>${produto.nome}</td>
                <td>${produto.tipo}</td>
                <td>${produto.unidade}</td>
                <td>${produto.cod}</td>
                <td>${produto.quantidade}</td>
                <td>${produto.preco}</td>
                <td>${produto.descricao}</td>
                <td>
                    <a type="button" data-bs-toggle="modal" data-bs-target="#editarProdutoModal" onclick="editarProduto(${produto.id}, ${fornecedor_id})"><img src="./public/img/favicon/edit.svg" style="height: 18px;"></a>
                    <a type="button" onclick="excluirProduto(${produto.id})"><img src="./public/img/favicon/trash-2.svg" style="height: 20px;"></a>
                </td>
            `;
            tbody.appendChild(tr);
        }

        produtosContainer.appendChild(tabela);
    } catch (error) {
        console.error('Erro ao construir a tabela de produtos:', error);
        produtosContainer.innerHTML = '<p>Erro ao carregar a lista de produtos</p>';
    }
}



async function editarLoja(id) {
    try {
        const response = await fetch(`/fornecedor/${id}`);
        const fornecedor = await response.json();

        document.getElementById('nomeLoja').value = fornecedor.nomeLoja;
        document.getElementById('descricaoLoja').value = fornecedor.descricaoLoja;

        // Define o ID do fornecedor no botão de envio do formulário
        const btnSalvarEdicao = document.getElementById('btnSalvarEdicao');
        btnSalvarEdicao.setAttribute('data-id', id);

        // Show the modal
        const modalElement = document.getElementById('editarLojaModal');
        modalElement.classList.add('show');
        modalElement.style.display = 'block';
        modalElement.removeAttribute('aria-hidden');
        modalElement.setAttribute('aria-modal', 'true');
        document.body.classList.add('modal-open');
    } catch (error) {
        console.error('Erro ao preencher o formulário de edição de loja:', error);
        alert('Erro ao preencher o formulário de edição de loja');
    }
}

// Função para editar Avatar

// Função para editar um produto
async function editarProduto(id, fornecedor_id) {
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
        document.getElementById('fornecedor_id').value = fornecedor_id;
        

        // Obter e definir a imagem do produto
        const imgSrc = await obterImagemProduto(produto.id);
        document.getElementById('img_produto_atual').src = imgSrc;
       


        // Define o ID do produto no botão de envio do formulário
        const btnSalvarEdicao = document.getElementById('btnSalvarEdicao');
        btnSalvarEdicao.setAttribute('data-id', id);

        // Mostrar o modal
        const modalElement = document.getElementById('editarProdutoModal');
        modalElement.classList.add('show');
        modalElement.style.display = 'block';
        modalElement.removeAttribute('aria-hidden');
        modalElement.setAttribute('aria-modal', 'true');
        document.body.classList.add('modal-open');
    } catch (error) {
        console.error('Erro ao preencher o formulário de edição de produto:', error);
        alert('Erro ao preencher o formulário de edição de produto');
    }
}

// Função para fechar o modal
function fecharModal() {
    const modalElement = document.getElementById('editarProdutoModal');
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.removeAttribute('aria-modal');
    document.body.classList.remove('modal-open');
}
// Função para enviar os dados do formulário de edição
async function enviarDadosFormulario() {
    try {
        const form = document.getElementById('editarProdutoForm');
        const btnSalvarEdicao = document.getElementById('btnSalvarEdicao');
        const id = btnSalvarEdicao.getAttribute('data-id');
        
        const formData = new FormData(form);

        const putResponse = await fetch(`/produto/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (!putResponse.ok) {
            throw new Error('Erro ao atualizar o produto');
        }

        alert('Produto atualizado com sucesso!');
        fecharModal(); // Fechar o modal após a atualização
        // Reconstruir a tabela de produtos
        const fornecedor_id = document.getElementById('fornecedor_id').value;
        construirTabelaProdutos(fornecedor_id);
    } catch (error) {
        console.error('Erro ao atualizar o produto:', error);
        alert('Erro ao atualizar o produto');
    }
}

// Função para excluir um produto
async function excluirProduto(id) {
    if (confirm('Deseja realmente excluir este produto?')) {
        try {
            const response = await fetch(`/produto/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Erro ao excluir o produto');
            }
            alert('Produto excluído com sucesso!');
            fetch('/usuario/user')
                .then(response => response.json())
                .then(user => {
                    if (user && user.fornecedor_id) {
                        construirTabelaProdutos(user.fornecedor_id);
                    }
                })
                .catch(error => console.error('Erro ao obter fornecedor_id:', error));
        } catch (error) {
            console.error('Erro ao excluir o produto:', error);
            alert('Erro ao excluir o produto');
        }
    }
}
