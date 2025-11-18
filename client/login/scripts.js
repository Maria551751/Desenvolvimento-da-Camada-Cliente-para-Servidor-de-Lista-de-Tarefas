// client/login/scripts.js

// 1. URL base do seu servidor FastAPI
const BASE_URL = 'http://localhost:8000';

// 2. Seleciona o formulário principal
const FORM_LOGIN = document.querySelector('form');

FORM_LOGIN.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captura os valores dos campos (email e password) do HTML
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Monta o "pacote de dados" (payload) conforme o esquema UserLogin
    const payload = {
        email: email,
        password: password
    };

    try {
        // Envia a requisição POST para o endpoint de Login
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
            // Sucesso (Status 200 OK)!
            
            // 🔑 PASSO CRUCIAL: Guarda o token (crachá) no navegador
            localStorage.setItem('accessToken', data.access_token);
            
            alert(`Login bem-sucedido! Bem-vindo(a), ${data.user.name}.`);
            
            // Redireciona para a página de tarefas (Dashboard)
            window.location.href = '../dashboard/index.html'; 

        } else if (response.status === 401) {
            // Erro de Credenciais Inválidas
            alert(`Erro no Login: ${data.detail}. Verifique seu e-mail e senha.`); 
            
        } else {
            // Outros erros
            alert(`Erro ao fazer login: ${data.detail || 'Falha desconhecida na comunicação.'}`);
        }

    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro ao conectar com o servidor. Verifique se o back-end está rodando em http://localhost:8000.');
    }
});