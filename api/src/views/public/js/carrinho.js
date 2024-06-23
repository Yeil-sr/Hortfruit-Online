document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const produtoIds = params.get('id');
    
    if (!produtoIds) {
        console.error('ID do produto não encontrado na URL');
        return;
    }
    const idsArray = produtoIds.split(',');
    let subtotal = 0;

    const produtosContainer = document.querySelector('.list-group');

    try {
        produtosContainer.innerHTML = ''; // Limpa o conteúdo anterior

        for (let id of idsArray) {
            try {
                const response = await fetch(`/produto/${id}`);
             
                const produto = await response.json();

                // Calcula o subtotal
                subtotal += produto.preco;

                // Cria o item do carrinho
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'py-3', 'py-lg-0', 'px-0', 'border-top');

                const itemHTML = `
                    <div class="row align-items-center" data-produto-id="${produto.id}">
                        <div class="col-3 col-md-2">
                            <img src="${await obterImagemProduto(produto.id)}" alt="${produto.nome}" class="img-fluid">
                        </div>
                        <div class="col-4 col-md-5">
                            <a href="produto.html?id=${produto.id}" class="text-decoration-none" style="color: rgb(2, 2, 63);">
                                <h6 class="mb-0">${produto.nome}</h6>
                            </a>
                            <span><small class="text-muted">${produto.tipo}</small></span>
                            <div class="mt-2 small lh-1">
                                <a href="#!" class="text-decoration-none text-inherit" onclick="removeItem('${produto.id}')">
                                    <span class="me-1 align-text-bottom">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2 text-success">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </span>
                                    <span class="text-muted">Remove</span>
                                </a>
                            </div>
                        </div>
                        <div class="col-3 col-md-3 col-lg-2">
                            <div class="number-input">
                                <button onclick="updateQuantity(this, -1, '${produto.id}', ${produto.preco})" class="minus">-</button>
                                <input class="quantity" min="0" name="quantity" value="1" type="number" onchange="updateQuantityInput(this, '${produto.id}', ${produto.preco})">
                                <button onclick="updateQuantity(this, 1, '${produto.id}', ${produto.preco})" class="plus">+</button>
                            </div>
                        </div>
                        <div class="col-2 text-lg-end text-start text-md-end col-md-2">
                            <span class="fw-bold item-price" style="font-size: 1.5rem;">R$ ${produto.preco.toFixed(2)}</span>
                        </div>
                    </div>
                `;

                listItem.innerHTML = itemHTML;
                produtosContainer.appendChild(listItem);

            } catch (error) {
                console.error(`Erro ao obter os dados do produto com ID :`, error);
                // Se ocorrer um erro ao obter um produto, continua para o próximo ID
                continue;
            }
        }

        // Após adicionar todos os itens, atualiza o subtotal
        updateSubtotal();

    } catch (error) {
        console.error('Erro ao obter os dados dos produtos:', error);
        produtosContainer.innerHTML = '<p>Erro ao carregar os itens do carrinho</p>';
    }
});

async function obterImagemProduto(produto_id) {
    try {
        const response = await fetch(`/produto/imagem/produto/${produto_id}`);
        if (!response.ok) {
            if (response.status === 404) {
                return './public/img/default-image.jpg';
            }
            throw new Error('Erro ao obter a imagem do produto');
        }
        const imageName = await response.text();
        return `/uploads/${imageName}`;
    } catch (error) {
        console.error('Erro ao obter a imagem do produto:', error);
        return './public/img/default-image.jpg';
    }
}

function updateQuantity(button, increment, produtoId, preco) {
    const quantityInput = button.parentNode.querySelector('input[type=number]');
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity += increment;
    if (currentQuantity < 0) currentQuantity = 0;
    quantityInput.value = currentQuantity;

    updatePrice(produtoId, currentQuantity, preco);
    updateSubtotal();
}

function updateQuantityInput(input, produtoId, preco) {
    let currentQuantity = parseInt(input.value);
    if (currentQuantity < 0) currentQuantity = 0;
    input.value = currentQuantity;

    updatePrice(produtoId, currentQuantity, preco);
    updateSubtotal();
}

function updatePrice(produtoId, quantity, preco) {
    const priceElement = document.querySelector(`.row[data-produto-id="${produtoId}"] .item-price`);
    if (priceElement) {
        priceElement.innerText = `R$ ${(quantity * preco).toFixed(2)}`;
    }
}

function updateSubtotal() {
    const priceElements = document.querySelectorAll('.item-price');
    let subtotal = 0;
    priceElements.forEach(priceElement => {
        subtotal += parseFloat(priceElement.innerText.replace('R$', ''));
    });

    const subtotalElement = document.querySelector('.list-group .subtotal');
    if (subtotalElement) {
        subtotalElement.innerText = `R$ ${subtotal.toFixed(2)}`;
    }
}

function removeItem(produtoId) {
    const itemElement = document.querySelector(`.row[data-produto-id="${produtoId}"]`).parentElement;
    if (itemElement) {
        itemElement.remove();
        updateSubtotal();
    }
}
