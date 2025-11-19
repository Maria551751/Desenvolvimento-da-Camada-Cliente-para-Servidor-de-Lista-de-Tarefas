// client/dashboard/scripts.js

// URL do servidor (Back-end)
const BASE_URL = 'http://localhost:8000';

// --- ELEMENTOS DO HTML ---
const tabelaCorpo = document.getElementById('corpo-tabela');
const displayTotalGeral = document.getElementById('total-geral');
const logoutButton = document.getElementById('botao-logout');
const btnAdicionar = document.getElementById('btn-adicionar-item');

// Variável para somar o total
let totalGeral = 0;


// --- 1. AUTENTICAÇÃO E SEGURANÇA ---

function getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
        // Se não tiver o "crachá" (token), manda de volta pro Login
        // Ajuste o caminho '../login' se sua pasta tiver outro nome
        window.location.href = '../login/index.html';
        return null; 
    }

    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// Botão de Sair
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('accessToken');
        window.location.href = '../login/index.html';
    });
}


// --- 2. FUNÇÕES VISUAIS (Formatação) ---

// Transforma número (10.5) em dinheiro (R$ 10,50)
function formatarMoeda(valor) {
    return parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


// --- 3. CARREGAR A LISTA (Ler do Servidor) ---

async function fetchItems() {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const response = await fetch(`${BASE_URL}/tasks`, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const data = await response.json();
            // O servidor devolve { tasks: [...] }
            renderizarTabela(data.tasks); 
        } else if (response.status === 401) {
            alert('Sua sessão expirou. Faça login novamente.');
            localStorage.removeItem('accessToken');
            window.location.href = '../login/index.html';
        }
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        alert('Erro de conexão com o servidor.');
    }
}


// --- 4. DESENHAR A TABELA ---

function renderizarTabela(tarefas) {
    tabelaCorpo.innerHTML = ''; // Limpa a tabela antes de desenhar
    totalGeral = 0; // Zera o total para recalcular

    tarefas.forEach(tarefa => {
        // --- A MÁGICA ---
        // O servidor guarda 'title' (Nome) e 'description' (Texto).
        // Nós guardamos o Preço e a Qtd escondidos dentro da 'description' como um JSON.
        
        let nome = tarefa.title;
        let preco = 0;
        let qtd = 1;

        try {
            // Tenta ler os dados escondidos
            const dadosExtras = JSON.parse(tarefa.description);
            preco = Number(dadosExtras.preco);
            qtd = Number(dadosExtras.qtd);
        } catch (e) {
            // Se der erro (ex: tarefa antiga ou sem descrição), ignora
            console.log("Item sem preço definido:", nome);
        }

        // Calcula o total desta linha
        const totalLinha = preco * qtd;
        totalGeral += totalLinha;

        // Cria o HTML da linha (tr)
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${nome}</td>
            <td>${formatarMoeda(preco)}</td>
            <td>${qtd}</td>
            <td><strong>${formatarMoeda(totalLinha)}</strong></td>
            <td>
                <button class="btn-remove" data-id="${tarefa.id}" title="Remover item">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        tabelaCorpo.appendChild(tr);
    });

    // Atualiza o Total Geral lá embaixo da tabela
    if (displayTotalGeral) {
        displayTotalGeral.innerHTML = `<strong>${formatarMoeda(totalGeral)}</strong>`;
    }
    
    // Re-ativa os botões de excluir das novas linhas
    adicionarEventosExcluir();
}


// --- 5. ADICIONAR NOVO ITEM (Enviar pro Servidor) ---

if (btnAdicionar) {
    btnAdicionar.addEventListener('click', async (e) => {
        e.preventDefault();

        const inputNome = document.getElementById('input-nome');
        const inputPreco = document.getElementById('input-preco');
        const inputQtd = document.getElementById('input-quantidade');

        const nome = inputNome.value;
        const preco = inputPreco.value; // Mantém como string por enquanto
        const qtd = inputQtd.value;

        // Validação
        if (!nome || !preco || !qtd) {
            alert("Preencha todos os campos!");
            return;
        }

        const headers = getAuthHeaders();
        if (!headers) return;

        // --- EMPACOTAR DADOS ---
        // O servidor só aceita 'title' e 'description'.
        // Guardamos o Preço e a Qtd dentro da 'description'.
        const dadosParaSalvar = JSON.stringify({
            preco: preco,
            qtd: qtd
        });

        const payload = {
            title: nome,
            description: dadosParaSalvar
        };

        try {
            const response = await fetch(`${BASE_URL}/tasks`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                // Limpar campos
                inputNome.value = '';
                inputPreco.value = '';
                inputQtd.value = '1';
                inputNome.focus();
                
                // Atualizar a tabela
                fetchItems();
            } else {
                alert("Erro ao adicionar item.");
            }
        } catch (error) {
            console.error("Erro de rede:", error);
        }
    });
}


// --- 6. EXCLUIR ITEM ---

function adicionarEventosExcluir() {
    const botoesExcluir = document.querySelectorAll('.btn-remove');

    botoesExcluir.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            // Pega o ID do item que guardamos no botão
            const id = e.target.closest('button').dataset.id;
            
            const headers = getAuthHeaders();
            if (!headers) return;

            if(!confirm("Tem certeza que deseja excluir este item?")) return;

            try {
                const response = await fetch(`${BASE_URL}/tasks/${id}`, {
                    method: 'DELETE',
                    headers: headers
                });

                if (response.status === 204) {
                    fetchItems(); // Recarrega a lista
                } else {
                    alert("Erro ao excluir.");
                }
            } catch (error) {
                console.error("Erro ao excluir:", error);
            }
        });
    });
}


// --- 7. MELHORIA DE USO (Selecionar texto ao clicar) ---
const inputsParaSelecionar = ['input-preco', 'input-quantidade', 'input-nome'];
inputsParaSelecionar.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('focus', function() {
            this.select();
        });
    }
});


// --- INICIALIZAÇÃO ---
// Quando a página abre, carrega os itens
document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
});