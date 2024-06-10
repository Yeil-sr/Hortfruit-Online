document.getElementById('btnLogin').addEventListener('click', formLogin);

async function formLogin(event) {
    event.preventDefault();

    const email = document.getElementById('txtEmail').value;
    const senha = document.getElementById('txtSenha').value;

    try {
        const response = await fetch('/usuario/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error('Erro no login: ' + data.error);
        }

        // Redirecionar com base no tipo de usuário
        if (data.isFornecedor) {
            window.location.href = '/fornecedor';
        } else {
            window.location.href = '/cliente';
        }
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}
