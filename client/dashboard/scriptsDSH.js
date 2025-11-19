// client/tarefas/scripts.js

const BASE_URL = 'http://localhost:8000';

// Elementos
const tabelaCorpo = document.getElementById('corpo-tabela');
const displayTotalGeral = document.getElementById('total-geral');
const logoutButton = document.getElementById('botao-logout');
const btnAdicionar = document.getElementById('btn-adicionar-item');

// Inputs
const inputNome = document.getElementById('input-nome');
const inputPreco = document.getElementById('input-preco');
const inputQtd = document.getElementById('input-quantidade');
const inputIdEdicao = document.getElementById('input-id-edicao');

let totalGeral = 0;

// --- AUTENTICAÇÃO ---
function getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '../login/index.html';
        return null; 
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('accessToken');
        window.location.href = '../login/index.html';
    });
}

// --- FORMATAÇÃO ---
function formatarMoeda(valor) {
    return parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- CARREGAR ---
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
            renderizarTabela(data.tasks);
        } else if (response.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '../login/index.html';
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// --- RENDERIZAR ---
function renderizarTabela(tarefas) {
    tabelaCorpo.innerHTML = '';
    totalGeral = 0;

    tarefas.forEach(tarefa => {
        let nome = tarefa.title;
        let preco = 0;
        let qtd = 1;

        try {
            const dadosExtras = JSON.parse(tarefa.description);
            preco = Number(dadosExtras.preco);
            qtd = Number(dadosExtras.qtd);
        } catch (e) { console.log("Item sem detalhes"); }

        const totalLinha = preco * qtd;
        totalGeral += totalLinha;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${nome}</td>
            <td>${formatarMoeda(preco)}</td>
            <td>${qtd}</td>
            <td><strong>${formatarMoeda(totalLinha)}</strong></td>
            <td>
                <button class="btn-acao btn-editar" 
                        data-id="${tarefa.id}" 
                        data-nome="${nome}"
                        data-preco="${preco}"
                        data-qtd="${qtd}">
                    <i class="fas fa-edit"></i>
                </button>
                
                <button class="btn-acao btn-excluir" data-id="${tarefa.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tabelaCorpo.appendChild(tr);
    });

    if (displayTotalGeral) {
        displayTotalGeral.innerHTML = `<strong>${formatarMoeda(totalGeral)}</strong>`;
    }
    
    adicionarEventosBotoes();
}

// --- ADICIONAR OU ATUALIZAR ---
btnAdicionar.addEventListener('click', async (e) => {
    e.preventDefault();

    const nome = inputNome.value;
    const preco = inputPreco.value;
    const qtd = inputQtd.value;
    const idParaEditar = inputIdEdicao.value; // Verifica se tem um ID aqui

    if (!nome || !preco || !qtd) {
        alert("Preencha todos os campos!");
        return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    const dadosParaSalvar = JSON.stringify({ preco: preco, qtd: qtd });
    const payload = { title: nome, description: dadosParaSalvar };

    try {
        let response;
        
        // SE TIVER ID, É EDIÇÃO (PUT). SE NÃO, É CRIAÇÃO (POST).
        if (idParaEditar) {
            response = await fetch(`${BASE_URL}/tasks/${idParaEditar}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(payload),
            });
        } else {
            response = await fetch(`${BASE_URL}/tasks`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });
        }

        if (response.ok) {
            limparFormulario();
            fetchItems();
        } else {
            alert("Erro ao salvar item.");
        }
    } catch (error) {
        console.error("Erro:", error);
    }
});

// --- EVENTOS DE EDITAR E EXCLUIR ---
function adicionarEventosBotoes() {
    // Botões Excluir
    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.closest('button').dataset.id;
            if(!confirm("Excluir este item?")) return;

            const headers = getAuthHeaders();
            if (!headers) return;

            await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE', headers: headers });
            fetchItems();
        });
    });

    // Botões Editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const botao = e.target.closest('button');
            
            // Pega os dados que guardamos no botão HTML
            const id = botao.dataset.id;
            const nome = botao.dataset.nome;
            const preco = botao.dataset.preco;
            const qtd = botao.dataset.qtd;

            // Joga os dados de volta nos inputs
            inputNome.value = nome;
            inputPreco.value = preco;
            inputQtd.value = qtd;
            inputIdEdicao.value = id; // Guarda o ID para sabermos que é edição

            // Muda o visual do botão para avisar que estamos editando
            btnAdicionar.innerHTML = 'Atualizar <i class="fas fa-sync-alt"></i>';
            btnAdicionar.style.backgroundColor = '#007bff'; // Muda pra azul
            
            inputNome.focus();
        });
    });
}

function limparFormulario() {
    inputNome.value = '';
    inputPreco.value = '';
    inputQtd.value = '1';
    inputIdEdicao.value = ''; // Limpa o ID
    
    // Volta o botão ao normal
    btnAdicionar.innerHTML = 'Adicionar <i class="fas fa-plus"></i>';
    btnAdicionar.style.backgroundColor = '#543271'; // Volta pra roxo
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', fetchItems);