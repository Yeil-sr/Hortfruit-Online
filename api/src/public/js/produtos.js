async function obterListaProdutos() {
    try {
        const response = await fetch('/produto/');
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

async function construirProdutos() {
    const produtosContainer = document.getElementById('produtosContainer');
    produtosContainer.innerHTML = ''; // Limpa o conteúdo atual

    try {
        // Obtendo a lista de produtos
        const produtos = await obterListaProdutos();

        // Adicionando cada produto como um card
        for (const produto of produtos) {
            const imgSrc = await obterImagemProduto(produto.id);
            const card = document.createElement('div');
            card.classList.add('col-xl-2', 'col-lg-3', 'col-md-4', 'col-sm-6', 'mb-4');
            card.innerHTML = `
                <div class="card text-center bg-white  btn-outline-success">
                    <a id="favorito-${produto.id}" href="#" class="position-absolute right-0 p-2 text-danger" title="adicionar ao favoritos">
                        <svg class="bi" width="20" height="20" fill="currentColor">
                            <use xlink:href="/bi.svg#suit-heart" />
                        </svg>
                    </a>
                    <img src="${imgSrc}" class="card-img-top" alt="Imagem do Produto">
                    <div class="card-header bg-white">
                        <div class="text-small mb-1">
                            <a href="#!" class="text-decoration-none text-muted"><small>${produto.tipo}</small></a>
                        </div>
                        <h2 class="fs-6"><a href="#" class="text-inherit text-dark text-decoration-none">${produto.nome}</a></h2>  
                        <div>
                            <small class="text-warning">
                                <a class="" href="#"> <img style="height:14px;" src="./public/img/favicon/star.png" alt=""><a>                                        
                                <a class="" href="#"> <img style="height:14px;" src="./public/img/favicon/star.png" alt=""><a> 
                                <a class="" href="#"> <img style="height:14px;" src="./public/img/favicon/star.png" alt=""><a>   
                                <a class="" href="#"> <img style="height:14px;" src="./public/img/favicon/star.png" alt=""><a>   
                            </small>
                            <span class="text-muted small">4,5 (67)</span>
                        </div>
                        <hr>
                        <div class="d-flex justify-content-center align-items-center mt-3">
                            <div>
                                <span class="text-dark">R$${produto.preco}</span>
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center align-items-center m-2">
                        <div>
                            <a href="produto.html?id=${produto.id}" class="btn btn-success btn-sm" style="width: 180px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Adicionar
                            </a>
                        </div>
                    </div>
                </div>
            `;
            produtosContainer.appendChild(card);
        }
    } catch (error) {
        // Em caso de erro, exibe uma mensagem de erro
        console.error('Erro ao construir a exibição dos produtos:', error);
        produtosContainer.innerHTML = '<p>Erro ao carregar a lista de produtos</p>';
    }
}

// Chama a função para construir os produtos ao carregar a página
document.addEventListener('DOMContentLoaded', construirProdutos);

