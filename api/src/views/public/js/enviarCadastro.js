document.getElementById('btnCadastrar').addEventListener('click', enviarCadastro);
document.getElementById('checkFornecedor').addEventListener('change', function(event) {
    const fornecedorModal = new bootstrap.Modal(document.getElementById('fornecedorModal'), {});
    if (event.target.checked) {
        fornecedorModal.show();
    }
});

async function enviarCadastro(event) {
    event.preventDefault();

    const nome = document.getElementById('txtNome').value;
    const email = document.getElementById('txtEmail').value;
    const senha = document.getElementById('txtSenha').value;
    const cfSenha = document.getElementById('txtCfSenha').value;
    const telefone = document.getElementById('txtTelefone').value;
    const rua = document.getElementById('txtRua').value;
    const numero = document.getElementById('txtNumero').value;
    const cidade = document.getElementById('txtCidade').value;
    const bairro = document.getElementById('txtBairro').value;
    const estado = document.getElementById('txtEstado').value;
    const cep = document.getElementById('cep').value;
    const complemento = document.getElementById('txtComplemento').value || '';
    const referencia = document.getElementById('txtReferencia').value || '';

    const errorMessage = document.getElementById('error-message');

    const upperCaseRegex = /[A-Z]/;
    const digitsRegex = /(\D*\d){3}/;
    const noAccentsRegex = /^[\w\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;

    if (senha.length === 0) {
        errorMessage.textContent = 'Campo obrigatório';
        return;
    } else if (senha.length <= 8) {
        errorMessage.textContent = 'Senha muito curta.';
        return;
    } else if (senha.startsWith(' ') || senha.endsWith(' ')) {
        errorMessage.textContent = 'A senha não deve começar ou terminar com um espaço em branco.';
        return;
    } else if (!upperCaseRegex.test(senha)) {
        errorMessage.textContent = 'A senha deve conter pelo menos uma letra maiúscula.';
        return;
    } else if (!digitsRegex.test(senha)) {
        errorMessage.textContent = 'A senha deve conter pelo menos três dígitos.';
        return;
    } else if (!noAccentsRegex.test(senha)) {
        errorMessage.textContent = 'A senha não deve conter acentos ou caracteres acentuados.';
        return;
    } else if (senha !== cfSenha) {
        errorMessage.textContent = 'As senhas não coincidem.';
        return;
    } else {
        errorMessage.textContent = '';
    }

    const endereco = {
        rua,
        numero,
        cidade,
        bairro,
        estado,
        cep,
        complemento,
        referencia
    };

    const isFornecedor = document.getElementById('checkFornecedor').checked;
    let nomeLoja, descricaoLoja, logoLoja;

    if (isFornecedor) {
        nomeLoja = document.getElementById('nomeLoja').value;
        descricaoLoja = document.getElementById('descricaoLoja').value;
        logoLoja = document.getElementById('logoLoja').files[0];
    }

    const userData = { nome, email, senha, telefone, isFornecedor };

    try {
        const responseUser = await fetch('/usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!responseUser.ok) {
            const errorData = await responseUser.json();
            throw new Error(`Erro ao cadastrar usuário: ${errorData.message}`);
        }

        const user = await responseUser.json();
        console.log('Usuário cadastrado:', user);

        const responseEndereco = await fetch('/endereco', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(endereco)
        });

        if (!responseEndereco.ok) {
            const errorData = await responseEndereco.json();
            throw new Error(`Erro ao cadastrar endereço: ${errorData.message}`);
        }

        const enderecoData = await responseEndereco.json();
        console.log('Endereço cadastrado:', enderecoData);

        if (isFornecedor) {
            const fornecedorData = {
                nome,
                email,
                telefone,
                endereco_id: enderecoData.id,
                nomeLoja,
                descricaoLoja,
                logoLoja
            };

            const formData = new FormData();
            Object.keys(fornecedorData).forEach(key => formData.append(key, fornecedorData[key]));

            const responseFornecedor = await fetch('/fornecedor', {
                method: 'POST',
                body: formData
            });

            if (!responseFornecedor.ok) {
                const errorData = await responseFornecedor.json();
                throw new Error(`Erro ao cadastrar fornecedor: ${errorData.message}`);
            }

            const fornecedor = await responseFornecedor.json();
            console.log('Fornecedor cadastrado:', fornecedor);
        } else {
            const clienteData = {
                nome,
                email,
                telefone,
                endereco_id: enderecoData.id
            };

            const responseCliente = await fetch('/cliente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clienteData)
            });

            if (!responseCliente.ok) {
                const errorData = await responseCliente.json();
                throw new Error(`Erro ao cadastrar cliente: ${errorData.message}`);
            }

            const cliente = await responseCliente.json();
            console.log('Cliente cadastrado:', cliente);
        }
        alert('Cadastro realizado com sucesso!');
        window.location.href = '/sucess';
          
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}
