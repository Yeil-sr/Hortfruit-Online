document.addEventListener("DOMContentLoaded", function() {
    // Função para carregar partials
    function loadPartial(partial) {
        fetch(`/partials/nav/${partial}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar o partial: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                document.getElementById('navbar').innerHTML = html;
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
                    document.getElementById('user-link').href = user.isFornecedor ? '/fornecedor' : '/cliente';
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
                }
            })
            .catch(error => console.error('Erro ao buscar informações do usuário:', error));
    }

    loadPartial('navbar.html');
});
