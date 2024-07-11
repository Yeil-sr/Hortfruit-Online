document.addEventListener('DOMContentLoaded', async function() {
    const paymentMethodInputs = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardInfo = document.getElementById('credit-card-info');
    const pixInfo = document.getElementById('pix-info');

    paymentMethodInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.id === 'credit') {
                creditCardInfo.style.display = 'block';
                pixInfo.style.display = 'none';
            } else if (this.id === 'pix') {
                creditCardInfo.style.display = 'none';
                pixInfo.style.display = 'block';
            } else {
                creditCardInfo.style.display = 'none';
                pixInfo.style.display = 'none';
            }
        });
    });

    const cartaoNome = document.getElementById('cartaoNome');
    const cartaoNumero = document.getElementById('cartaoNumero');
    const cartaoExpiracao = document.getElementById('cartaoExpiracao');
    const cartaoCodigo = document.getElementById('cartaoCodigo');
    const finalizarCompra = document.getElementById('finalizarCompra');

    const acceptedCreditCards = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-9][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
        amex: /^3[47][0-9]{13}$/,
        discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
        diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
    };

    function validateCard(value) {
        value = value.replace(/\D/g, '');
        let sum = 0;
        let shouldDouble = false;

        for (let i = value.length - 1; i >= 0; i--) {
            let digit = parseInt(value.charAt(i));
            if (shouldDouble) {
                if ((digit *= 2) > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }

        let valid = (sum % 10) == 0;
        let accepted = false;

        Object.keys(acceptedCreditCards).forEach(function(key) {
            let regex = acceptedCreditCards[key];
            if (regex.test(value)) {
                accepted = true;
            }
        });

        return valid && accepted;
    }

    function validateCVV(creditCard, cvv) {
        creditCard = creditCard.replace(/\D/g, '');
        cvv = cvv.replace(/\D/g, '');
        if ((acceptedCreditCards.amex).test(creditCard)) {
            return (/^\d{4}$/).test(cvv);
        } else {
            return (/^\d{3}$/).test(cvv);
        }
    }

    function formatCardNumber(value) {
        value = value.replace(/\D/g, '');
        let formattedValue;
        let maxLength;

        if ((/^3[47]\d{0,13}$/).test(value)) {
            formattedValue = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ');
            maxLength = 17;
        } else if ((/^3(?:0[0-5]|[68]\d)\d{0,11}$/).test(value)) {
            formattedValue = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ');
            maxLength = 16;
        } else if ((/^\d{0,16}$/).test(value)) {
            formattedValue = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
            maxLength = 19;
        }

        cartaoNumero.setAttribute('maxlength', maxLength);
        return formattedValue;
    }

    function validatePaymentDetails() {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').id;
        const nome = cartaoNome.value;
        const numero = cartaoNumero.value;
        const expiracao = cartaoExpiracao.value;
        const codigo = cartaoCodigo.value;

        if (paymentMethod === 'credit') {
            if (!nome) {
                alert('O nome no cartão é obrigatório');
                return false;
            }
            if (!numero || !validateCard(numero)) {
                alert('O número do cartão de crédito é obrigatório e deve ser válido');
                return false;
            }
            if (!expiracao || !/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(expiracao)) {
                alert('Data de expiração inválida. Use o formato MM/AA');
                return false;
            }
            if (!codigo || !validateCVV(numero, codigo)) {
                alert('O código de segurança é obrigatório e deve ser válido');
                return false;
            }
        }
        return true;
    }

    $('#cartaoNumero, #cartaoCodigo').on('input', function() {
        if (validateCard(cartaoNumero.value) && validateCVV(cartaoNumero.value, cartaoCodigo.value)) {
            finalizarCompra.disabled = true;
        } else {
            finalizarCompra.disabled = false;
        }

        let node = cartaoNumero; 
        let cursor = node.selectionStart; 
        let lastValue = cartaoNumero.value; 

        let formattedValue = formatCardNumber(lastValue);
        cartaoNumero.value = formattedValue; 

        if (cursor === lastValue.length) {
            cursor = formattedValue.length;
            if (cartaoNumero.getAttribute('data-lastvalue') && cartaoNumero.getAttribute('data-lastvalue').charAt(cursor - 1) == " ") {
                cursor--;
            }
        }

        if (lastValue != formattedValue) {
            if (lastValue.charAt(cursor) == " " && formattedValue.charAt(cursor - 1) == " ") {
                cursor++;
            }
        }

        node.selectionStart = cursor;
        node.selectionEnd = cursor;
        cartaoNumero.setAttribute('data-lastvalue', formattedValue);
    });

    async function enviarTotalDoCarrinho(userId) {
        try {
            const subtotal = parseFloat(localStorage.getItem('subtotal'));
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
    
            return data; // Retornar o objeto com valor_total
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }
    
    finalizarCompra.addEventListener('click', async function(event) {
        event.preventDefault();
    
        const email = document.getElementById('email').value;
        const endereco = document.getElementById('endereco').value;
        const sameAddress = document.getElementById('same-address').checked;
        const saveInfo = document.getElementById('save-info').checked;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').id;
    
        if (!validatePaymentDetails()) {
            return;
        }
    
        try {
            const userResponse = await fetch(`/usuario/user/email/${email}`);
            const userData = await userResponse.json();
    
            if (!userResponse.ok) {
                throw new Error(userData.message || 'Erro ao obter usuário');
            }
    
            const userId = userData.userId;
    
            let valor_total;
            try {
                const result = await enviarTotalDoCarrinho(userId);
                valor_total = result.valor_total;
                document.getElementById('subtotal').textContent = `Subtotal: R$ ${localStorage.getItem('subtotal')}`;
                document.getElementById('total').textContent = `Total: R$ ${valor_total.toFixed(2)}`;
            } catch (error) {
                console.error(error.message);
                document.getElementById('subtotal').textContent = 'Erro ao obter subtotal do carrinho';
                document.getElementById('total').textContent = 'Erro ao calcular total';
                return;
            }
    
            const paymentData = {
                tipo: paymentMethod,
                metodo: 'online',
                data: new Date().toISOString().split('T')[0]
            };
    
            if (paymentMethod === 'credit') {
                paymentData.cartao = {
                    titular: cartaoNome.value,
                    numCartao: cartaoNumero.value,
                    dataExpiracao: cartaoExpiracao.value,
                    cvv: cartaoCodigo.value
                };
            } else if (paymentMethod === 'boleto') {
                paymentData.boleto = {
                    dataVencimento: '2024-12-31',
                    instrucoes: 'Pagar até a data de vencimento'
                };
            } else if (paymentMethod === 'pix') {
                paymentData.pix = {
                    chave: 'chave-pix-exemplo'
                };
            }
    
            const paymentResponse = await fetch('/pagamento/processar/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });
    
            const paymentResult = await paymentResponse.json();
    
            if (!paymentResponse.ok) {
                throw new Error(paymentResult.message || 'Erro ao processar pagamento');
            }
    
            const orderData = {
                userId: userId,
                valor_total: valor_total, // Usar valor_total calculado anteriormente
                pagamentoId: paymentResult.pagamentoId,
                endereco: endereco,
                mesmaEntrega: sameAddress,
                salvarInfo: saveInfo,
                data_venda: new Date().toISOString().split('T')[0]
            };
    
            const orderResponse = await fetch('/pedido/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });
    
            const orderResult = await orderResponse.json();
    
            if (!orderResponse.ok) {
                throw new Error(orderResult.message || 'Erro ao criar pedido');
            }
    
            alert('Compra finalizada com sucesso!');
            window.location.href = '/fechamento_pedido.html';
        } catch (error) {
            console.error('Erro ao finalizar compra:', error);
            alert('Erro ao finalizar compra. Por favor, tente novamente.');
        }
    });
        
    // Atualizar a barra lateral com os valores corretos
    function updateSidebar() {
        const subtotalElement = document.getElementById('subtotal');
        const taxaServicoElement = document.getElementById('taxa-servico');
        const totalElement = document.getElementById('total');
        const totalBtnElement = document.getElementById('total-btn');

        const subtotal = parseFloat(localStorage.getItem('subtotal')) || 0;
        const taxaServico = 2.99; // Supondo uma taxa fixa de serviço
        const total = subtotal + taxaServico;

        if (subtotalElement && taxaServicoElement && totalElement && totalBtnElement) {
            subtotalElement.innerText = `Subtotal: R$ ${subtotal.toFixed(2)}`;
            taxaServicoElement.innerText = `Taxa de Serviço: R$ ${taxaServico.toFixed(2)}`;
            totalBtnElement.innerText = `Total: R$ ${total.toFixed(2)}`;
            totalElement.innerText = `Total: R$ ${total.toFixed(2)}`;
        }
    }

    updateSidebar();
});