document.addEventListener("DOMContentLoaded", function() {
    // Função para carregar partials
    function loadPartial(partial) {
        fetch(`/partials/footer/${partial}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar o partial: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                document.getElementById('footer').innerHTML = html;
                updateUserInfo();
            })
            .catch(error => console.error('Erro ao carregar o partial:', error));
    }

    
    loadPartial('footer.html');
});
