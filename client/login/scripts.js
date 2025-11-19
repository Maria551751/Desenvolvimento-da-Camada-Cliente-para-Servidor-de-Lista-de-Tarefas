// client/login/scripts.js

const BASE_URL = 'http://localhost:8000';

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.querySelector('form');
    
    // Elementos do Modal de Erro
    const modalErro = document.getElementById('modal-erro');
    const textoErro = document.getElementById('mensagem-erro-texto');
    const btnFecharModal = document.getElementById('btn-fechar-modal');

    // Função para mostrar o Modal
    function mostrarErro(mensagem) {
        if(textoErro && modalErro) {
            textoErro.textContent = mensagem;
            modalErro.classList.remove('hidden');
        } else {
            alert(mensagem); 
        }
    }

    // Fechar modal pelo botão
    if(btnFecharModal) {
        btnFecharModal.addEventListener('click', () => {
            modalErro.classList.add('hidden');
        });
    }

    // Fechar modal clicando fora
    if(modalErro) {
        modalErro.addEventListener('click', (e) => {
            if (e.target === modalErro) {
                modalErro.classList.add('hidden');
            }
        });
    }

    // Lógica do Login
    formLogin.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            mostrarErro("Por favor, preencha todos os campos.");
            return;
        }

        const payload = {
            email: email,
            password: password
        };

        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                // --- SUCESSO! ---
                localStorage.setItem('accessToken', data.access_token);
                
                if (data.user && data.user.name) {
                    localStorage.setItem('userName', data.user.name);
                }
                
                
                window.location.href = '../dashboard/index.html';

            } else {
                // --- ERRO ---
                if (response.status === 401) {
                    mostrarErro("E-mail ou senha incorretos.");
                } else {
                    mostrarErro(`Erro: ${data.detail || 'Tente novamente.'}`);
                }
            }

        } catch (error) {
            console.error("Erro de rede:", error);
            mostrarErro("Sem conexão com o servidor.");
        }
    });
});