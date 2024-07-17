// Função para obter o ID do usuário logado
async function obterUsuario() {
    try {
        const response = await fetch('/usuario/user');
        if (!response.ok) {
            throw new Error('Erro ao obter informações do usuário');
        }
        const usuario = await response.json();
        return usuario.id;  // Supondo que o objeto retornado tenha um campo 'id'
    } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async function () {

    const limpaCart = document.getElementById('limpaCart');
    limpaCart.addEventListener('click', async function limparCarrinho() {
        try {
            const userId = await obterUsuario();
            const response = await fetch(`/carrinho/clear/${userId}`, {
                method: 'DELETE'
            });
    
            if (!response.ok) {
                throw new Error('Erro ao limpar o carrinho');
            }
    
            // Clear localStorage
            localStorage.removeItem('produtoIds');
            localStorage.removeItem('quantidades');
            localStorage.setItem('subtotal', '0.00');
    
            // Update the UI
            produtosContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            updateSubtotal(userId);
    
            console.log('Carrinho limpo com sucesso:', await response.json());
        } catch (error) {
            console.error(error);
        }
    });
    

    const userId = await obterUsuario();
    if (!userId) {
        console.error('Usuário não encontrado. Redirecionando para a página de login.');
        window.location.href = '/login.html';
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const produtoIds = params.get('id');

    if (produtoIds) {
        const idsArray = produtoIds.split(',');
        let storedIds = JSON.parse(localStorage.getItem('produtoIds')) || [];
        storedIds = [...new Set([...storedIds, ...idsArray])];
        localStorage.setItem('produtoIds', JSON.stringify(storedIds));
        const newURL = window.location.origin + window.location.pathname;
        window.history.pushState({}, document.title, newURL);
    }

    const storedIds = JSON.parse(localStorage.getItem('produtoIds')) || [];

    if (storedIds.length === 0) {
        console.error('Nenhum produto no carrinho');
        return;
    }

    let subtotal = 0;
    const produtosContainer = document.querySelector('.list-group');

    try {
        produtosContainer.innerHTML = '';

        for (const id of storedIds) {
            try {
                const response = await fetch(`/produto/${id}`);
                if (!response.ok) {
                    throw new Error(`Erro ao obter os dados do produto com ID ${id}`);
                }

                const produto = await response.json();
                if (!produto || !produto.preco) {
                    throw new Error(`Produto com ID ${id} está indefinido ou não tem preço`);
                }

                let quantidade = JSON.parse(localStorage.getItem('quantidades'))?.[id] || 1;
                subtotal += produto.preco * quantidade;

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
                <a href="#!" class="text-decoration-none text-inherit" onclick="removeItem('${produto.id}', ${userId})">
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
                <button onclick="updateQuantity(this, -1, '${produto.id}', ${produto.preco}, ${userId})" class="minus">-</button>
                <input class="quantity" min="0" name="quantity" value="${quantidade}" type="number" onchange="updateQuantityInput(this, '${produto.id}', ${produto.preco}, ${userId})">
                <button onclick="updateQuantity(this, 1, '${produto.id}', ${produto.preco}, ${userId})" class="plus">+</button>
            </div>
        </div>
        <div class="col-2 text-lg-end text-start text-md-end col-md-2">
            <span class="fw-bold item-price" style="font-size: 1.5rem;">R$ ${(produto.preco * quantidade).toFixed(2)}</span>
        </div>
    </div>
`;

                listItem.innerHTML = itemHTML;
                produtosContainer.appendChild(listItem);

            } catch (error) {
                console.error(`Erro ao obter os dados do produto com ID ${id}:`, error);
            }
        }

        localStorage.setItem('subtotal', subtotal.toFixed(2));  // Salva o subtotal no localStorage
        updateSubtotal(userId);

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

async function adicionarItemAoCarrinho(produtoId, quantidade = 1) {
    try {
        const response = await fetch('/carrinho/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ produtoId, quantidade })
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar item ao carrinho');
        }

        const data = await response.json();
        console.log('Item adicionado ao carrinho:', data);
    } catch (error) {
        console.error(error);
    }
}

async function atualizarItemNoCarrinho(produtoId, quantidade, userId) {
    try {
        const response = await fetch('/carrinho/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ produtoId, quantidade, userId })
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar item no carrinho');
        }

        const data = await response.json();
        console.log('Item atualizado no carrinho:', data);
    } catch (error) {
        console.error(error);
    }
}
async function enviarTotalDoCarrinho(userId) {
    try {
        const subtotal = parseFloat(localStorage.getItem('subtotal')) || 0; // Garantindo que seja um número válido
        const taxaServico = 2.99;
        const valor_total = subtotal + taxaServico;

        const response = await fetch(`/carrinho/total/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ valor_total })
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar o total do carrinho');
        }

        const data = await response.json();
        console.log('Total do carrinho enviado:', data);

        return data.total; // Retorna o total calculado do servidor
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}
async function updateSubtotal(userId) {
    const subtotalElement = document.querySelector('.carrinho-subtotal');
    if (subtotalElement) {
        const subtotal = parseFloat(localStorage.getItem('subtotal')) || 0;
        subtotalElement.textContent = `Subtotal: R$ ${subtotal.toFixed(2)}`;
        await enviarTotalDoCarrinho(userId);
    } else {
        console.error("Elemento '.carrinho-subtotal' não encontrado no DOM.");
    }
}

async function removeItem(produtoId, userId) {
    let storedIds = JSON.parse(localStorage.getItem('produtoIds')) || [];
    storedIds = storedIds.filter(id => id !== produtoId);
    localStorage.setItem('produtoIds', JSON.stringify(storedIds));

    // Update the quantities in localStorage
    let quantidades = JSON.parse(localStorage.getItem('quantidades')) || {};
    delete quantidades[produtoId];
    localStorage.setItem('quantidades', JSON.stringify(quantidades));

    // Remove the item from the DOM
    const itemElement = document.querySelector(`.list-group-item[data-produto-id="${produtoId}"]`);
    if (itemElement) {
        itemElement.remove();
    }

    // Recalculate subtotal
    let subtotal = 0;
    storedIds.forEach(id => {
        const quantidade = quantidades[id] || 1;
        const produtoElement = document.querySelector(`.list-group-item[data-produto-id="${id}"]`);
        if (produtoElement) {
            const precoElement = produtoElement.querySelector('.item-price');
            if (precoElement) {
                const preco = parseFloat(precoElement.textContent.replace('R$', ''));
                subtotal += preco * quantidade;
            }
        }
    });

    localStorage.setItem('subtotal', subtotal.toFixed(2));
    await updateSubtotal(userId);

    // Send request to remove the item from the cart on the server
    try {
        const response = await fetch(`/carrinho/remove/${userId}/${produtoId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao remover o item do carrinho');
        }

        console.log('Item removido do carrinho:', produtoId);
    } catch (error) {
        console.error(error);
    }
}


function updateSidebar() {
    const subtotalElement = document.getElementById('subtotal');
    const taxaServicoElement = document.getElementById('taxa-servico');
    const totalElement = document.getElementById('total');

    const subtotal = parseFloat(localStorage.getItem('subtotal')) || 0;
    const taxaServico = 2.99; // Supondo uma taxa fixa de serviço
    const total = subtotal + taxaServico;

    if (subtotalElement && taxaServicoElement && totalElement) {
        subtotalElement.innerText = `Subtotal: R$ ${subtotal.toFixed(2)}`;
        taxaServicoElement.innerText = `Taxa de Serviço: R$ ${taxaServico.toFixed(2)}`;
        totalElement.innerText = `Total: R$ ${total.toFixed(2)}`;
    }
}

updateSidebar();

function updateQuantity(button, increment, produtoId, preco, userId) {
    const input = button.closest('.number-input').querySelector('input');
    let quantidade = parseInt(input.value, 10);
    quantidade += increment;

    if (quantidade < 1) {
        quantidade = 1;
    }

    input.value = quantidade;
    const itemPriceElement = button.closest('.row').querySelector('.item-price');
    itemPriceElement.textContent = `R$ ${(preco * quantidade).toFixed(2)}`;

    // Atualizar o localStorage
    let quantidades = JSON.parse(localStorage.getItem('quantidades')) || {};
    quantidades[produtoId] = quantidade;
    localStorage.setItem('quantidades', JSON.stringify(quantidades));

    // Recalcular o subtotal
    let subtotal = 0;
    const storedIds = JSON.parse(localStorage.getItem('produtoIds')) || [];
    storedIds.forEach(id => {
        const quantidade = quantidades[id] || 1;
        subtotal += quantidade * preco;
    });

    localStorage.setItem('subtotal', subtotal.toFixed(2));
    updateSubtotal(userId);

    // Atualizar a quantidade no backend
    atualizarItemNoCarrinho(produtoId, quantidade, userId);
}

function updateQuantityInput(input, produtoId, preco, userId) {
    let quantidade = parseInt(input.value, 10);

    if (quantidade < 1) {
        quantidade = 1;
        input.value = quantidade;
    }

    const itemPriceElement = input.closest('.row').querySelector('.item-price');
    itemPriceElement.textContent = `R$ ${(preco * quantidade).toFixed(2)}`;

    // Atualizar o localStorage
    let quantidades = JSON.parse(localStorage.getItem('quantidades')) || {};
    quantidades[produtoId] = quantidade;
    localStorage.setItem('quantidades', JSON.stringify(quantidades));

    // Recalcular o subtotal
    let subtotal = 0;
    const storedIds = JSON.parse(localStorage.getItem('produtoIds')) || [];
    storedIds.forEach(id => {
        const quantidade = quantidades[id] || 1;
        subtotal += quantidade * preco;
    });

    

    localStorage.setItem('subtotal', subtotal.toFixed(2));
    updateSubtotal(userId);

    // Atualizar a quantidade no backend
    atualizarItemNoCarrinho(produtoId, quantidade, userId);
}
