document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const produtoId = params.get('id');

    if (!produtoId) {
        console.error('ID do produto não encontrado na URL');
        return;
    }

    try {
        const response = await fetch(`/produto/${produtoId}`);
        if (!response.ok) {
            throw new Error('Erro ao obter os dados do produto');
        }
        const produto = await response.json();

        // Atualiza os elementos da página com os dados do produto
        document.querySelector('.mb-4.d-block.text-decoration-none').innerText = produto.tipo;
        document.querySelector('h1.mb-1').innerText = produto.nome;
        document.querySelector('.fs-4 .fw-bold.text-dark').innerText = `R$ ${produto.preco}`;
        document.querySelector('.table-borderless tr:nth-child(1) td:nth-child(2)').innerText = produto.cod;
        document.querySelector('.table-borderless tr:nth-child(2) td:nth-child(2)').innerText = produto.quantidade > 0 ? 'Em estoque' : 'Indisponível';
        document.querySelector('.table-borderless tr:nth-child(3) td:nth-child(2)').innerText = produto.tipo;

        // Atualiza a imagem do produto principal
        const imgSrc = await obterImagemProduto(produto.id);
        let imgProdutoElement = document.getElementById('imgProduto');
        if (!imgProdutoElement) {
            imgProdutoElement = document.createElement('img');
            imgProdutoElement.id = 'imgProduto';
            imgProdutoElement.classList.add('img-thumbnail');
            imgProdutoElement.style.width = '75%';
            imgProdutoElement.style.display = 'block';
            imgProdutoElement.style.margin = '0 auto';

            const container = document.getElementById('produto-imagem-container');
            if (container) {
                container.appendChild(imgProdutoElement);
            } else {
                console.error('Contêiner de imagem do produto não encontrado.');
            }
        }
        imgProdutoElement.src = imgSrc;

        // Adiciona as imagens adicionais dos produtos
        const divImagensContainer = document.createElement('div');
        divImagensContainer.classList.add('row', 'my-3', 'gx-3');
        divImagensContainer.style.margin = '0 50px';

        const imagens = [
            './public/img/produtos/000001.jpg',
            './public/img/produtos/000002.jpg',
            './public/img/produtos/000003.jpg',
            './public/img/produtos/000004.jpg'
        ];

        imagens.forEach(imagemSrc => {
            const divCol = document.createElement('div');
            divCol.classList.add('col-3');

            const img = document.createElement('img');
            img.src = imagemSrc;
            img.classList.add('img-thumbnail');
            img.onclick = function() {
                trocarImagem(img); // Define a função de troca de imagem (se necessário)
            };

            divCol.appendChild(img);
            divImagensContainer.appendChild(divCol);
        });

        const produtosContainer = document.getElementById('produtosContainer');
        if (produtosContainer) {
            produtosContainer.appendChild(divImagensContainer);
        } else {
            console.error('Container de imagens de produtos não encontrado.');
        }

      

    } catch (error) {
        console.error('Erro ao obter os dados do produto:', error);
        document.querySelector('.row.g-3').innerHTML = '<p>Erro ao carregar os detalhes do produto</p>';
    }
});

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


