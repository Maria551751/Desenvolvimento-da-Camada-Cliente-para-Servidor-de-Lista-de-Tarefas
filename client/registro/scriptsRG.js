// client/registro/scripts.js

const BASE_URL = 'http://localhost:8000';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        // ESTA LINHA É A MAIS IMPORTANTE: Ela impede a página de recarregar
        event.preventDefault(); 

        // Captura os dados
        // Certifique-se que no HTML os IDs são: id="name", id="email", id="password"
        const nameInput = document.querySelector('input[placeholder="Nome completo"]');
        const emailInput = document.querySelector('input[placeholder="E-mail"]');
        const passwordInput = document.querySelector('input[placeholder="Senha"]');

        const payload = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        };

        try {
            const response = await fetch(`${BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Cadastro realizado com sucesso!');
                // AQUI ESTÁ O REDIRECIONAMENTO PARA O LOGIN
                window.location.href = '../login/index.html';
            } else {
                const errorData = await response.json();
                alert(`Erro: ${errorData.detail || 'Falha ao cadastrar'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão com o servidor.');
        }
    });
});