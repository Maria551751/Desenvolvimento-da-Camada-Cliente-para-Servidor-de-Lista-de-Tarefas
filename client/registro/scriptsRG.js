// client/registro/scripts.js

// 1. URL base do seu servidor FastAPI
const BASE_URL = 'http://localhost:8000'; 

// 2. Seleciona o formulário principal
const FORM_REGISTRO = document.querySelector('form');

FORM_REGISTRO.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captura os valores dos campos atualizados do HTML
    // O ID "name" é crucial para o Back-end
    const name = document.getElementById('name').value; 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // ATENÇÃO: O campo "confirm-password" foi removido. 
    // Se quiser adicionar validação de senha (tamanho mínimo), faça aqui.
    if (password.length < 4) { // Requisito mínimo do Back-end (schema UserCreate)
        alert("A senha deve ter pelo menos 4 caracteres.");
        return;
    }

    // Monta o "pacote de dados" (payload) com os três campos obrigatórios
    const payload = { 
        name: name,
        email: email,
        password: password
    };

    try {
        // Envia a requisição POST para o endpoint de Registro
        const response = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
            // Sucesso (Status 201 Created)!
            
            // 🔑 PASSO CRUCIAL: Guarda o token (crachá) no navegador
            localStorage.setItem('accessToken', data.access_token);
            
            alert(`Registro bem-sucedido! Bem-vindo(a), ${data.user.name}.`);
            
            // Redireciona para a página de tarefas
            window.location.href = '../dashboard/index.html'; 

        } else if (response.status === 409) {
            // Erro: E-mail já cadastrado
            alert(`Erro: ${data.detail}. Por favor, tente fazer login.`); 
            
        } else {
            // Outros erros (ex: validação de Pydantic no Back-end)
            alert(`Erro ao registrar: ${data.detail || 'Falha desconhecida na comunicação.'}`);
        }

    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro ao conectar com o servidor. Verifique se o back-end está rodando em http://localhost:8000.');
    }
});