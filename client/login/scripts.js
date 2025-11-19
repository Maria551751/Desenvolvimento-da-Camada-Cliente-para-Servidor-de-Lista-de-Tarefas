// client/login/scripts.js

// URL do servidor (Back-end)
const BASE_URL = 'http://localhost:8000';

document.addEventListener('DOMContentLoaded', () => {
    
    const formLogin = document.querySelector('form');

    formLogin.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede a página de recarregar

        // 1. Captura os dados digitados
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validação básica
        if (!email || !password) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // 2. Monta o pacote de dados
        const payload = {
            email: email,
            password: password
        };

        try {
            // 3. Envia para o servidor (Endpoint de Login)
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                // --- SUCESSO! ---
                
                // 4. Salva o Token (o "crachá") no navegador
                // É isso que permite entrar no Dashboard depois
                localStorage.setItem('accessToken', data.access_token);

                // (Opcional) Salva o nome do usuário para mostrar depois
                if (data.user && data.user.name) {
                    localStorage.setItem('userName', data.user.name);
                }

                alert("Login realizado com sucesso!");

                // 5. REDIRECIONA PARA A LISTA DE COMPRAS
                // Nota: Usamos '../tarefas' porque é o nome da sua pasta
                window.location.href = '../dashboard/index.html';

            } else {
                // --- ERRO ---
                if (response.status === 401) {
                    alert("E-mail ou senha incorretos.");
                } else {
                    alert(`Erro ao entrar: ${data.detail || 'Tente novamente mais tarde.'}`);
                }
            }

        } catch (error) {
            console.error("Erro de rede:", error);
            alert("Erro ao conectar com o servidor. Verifique se ele está ligado.");
        }
    });
});