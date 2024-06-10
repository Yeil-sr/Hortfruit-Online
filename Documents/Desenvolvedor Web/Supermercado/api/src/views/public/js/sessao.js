document.addEventListener("DOMContentLoaded", function() {
    // Função para carregar partials
    function loadPartial(partial) {
        fetch(`/cliente/partials/cliente${partial}`)
            .then(response => response.text())
            .then(html => {
                document.getElementById('content').innerHTML = html;
                updateUserInfo();
            })
            .catch(error => console.error('Erro ao carregar o partial:', error));
    }
    document.querySelectorAll('.auth-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = event.currentTarget.getAttribute('id');
            if (target === 'auth-link') {
                fetch('/usuario/logout', { method: 'POST' })
                    .then(response => {
                        if (response.ok) {
                            updateUserInfo(); // Chama a função após o logout bem-sucedido
                            window.location.href = '/';
                        } else {
                            alert('Erro ao fazer logout');
                        }
                    });
            } else if (target === 'user-link') {
                // Lógica para redirecionar para a página de cadastro
            }
        });
    });
    

    // Carregar dados do usuário
    function updateUserInfo() {
        fetch('/usuario/user')
            .then(response => response.json())
            .then(user => {
                if (user && user.nome) {
                   
                    document.getElementById('user-link').textContent = user.nome;
                    document.getElementById('auth-link').textContent = 'Sair';
                    document.getElementById('auth-link').href = '/login';
                   
                }
            })
        fetch()
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
    loadPartial('cliente_dados.html');
});
