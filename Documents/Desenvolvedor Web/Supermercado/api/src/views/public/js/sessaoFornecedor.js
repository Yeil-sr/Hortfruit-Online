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

                    // Carregar a lista de produtos do fornecedor usando o fornecedor_id
                    construirTabelaProdutos(user.fornecedor_id);
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
    loadPartial('fornecedor_dados.html');
});
