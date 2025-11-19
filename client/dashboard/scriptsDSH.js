// client/tarefas/scripts.js

const BASE_URL = 'http://localhost:8000';

// Elementos Principais
const tabelaCorpo = document.getElementById('corpo-tabela');
const logoutButton = document.getElementById('botao-logout');
const btnAdicionar = document.getElementById('btn-adicionar-item');
const inputTitulo = document.getElementById('input-titulo');
const inputDescricao = document.getElementById('input-descricao');
const inputIdEdicao = document.getElementById('input-id-edicao');

// Elementos do MODAL
const modalConfirmacao = document.getElementById('modal-confirmacao');
const btnCancelarModal = document.getElementById('btn-cancelar-modal');
const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao');

// Variável para guardar qual ID vamos excluir
let idParaExcluir = null;

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

// --- LÓGICA DO MODAL DE LOGOUT ---

const modalLogout = document.getElementById('modal-logout');
const btnCancelarLogout = document.getElementById('btn-cancelar-logout');
const btnConfirmarLogout = document.getElementById('btn-confirmar-logout');

// 1. Quando clica no botão "Sair" lá em cima
if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        modalLogout.classList.remove('hidden'); // Mostra a janelinha
    });
}

// 2. Quando clica em "Cancelar"
if (btnCancelarLogout) {
    btnCancelarLogout.addEventListener('click', () => {
        modalLogout.classList.add('hidden'); // Esconde a janelinha
    });
}

// 3. Quando clica em "Sim, Sair" (Ação Real)
if (btnConfirmarLogout) {
    btnConfirmarLogout.addEventListener('click', () => {
        // Aqui sim fazemos o logout de verdade
        localStorage.removeItem('accessToken');
        window.location.href = '../login/index.html';
    });
}

// --- CARREGAR TAREFAS ---
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

    if (tarefas.length === 0) {
        tabelaCorpo.innerHTML = '<tr><td colspan="3" style="text-align:center;">Nenhuma tarefa encontrada.</td></tr>';
        return;
    }

    tarefas.forEach(tarefa => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${tarefa.title}</strong></td>
            <td>${tarefa.description || '-'}</td>
            <td>
                <button class="btn-acao btn-editar" 
                        data-id="${tarefa.id}" 
                        data-title="${tarefa.title}"
                        data-description="${tarefa.description}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-acao btn-excluir" data-id="${tarefa.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tabelaCorpo.appendChild(tr);
    });

    adicionarEventosBotoes();
}

// --- SALVAR (CRIAR OU EDITAR) ---
btnAdicionar.addEventListener('click', async (e) => {
    e.preventDefault();
    const titulo = inputTitulo.value;
    const descricao = inputDescricao.value;
    const idParaEditar = inputIdEdicao.value;

    if (!titulo) {
        alert("O título da tarefa é obrigatório!");
        return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    const payload = { title: titulo, description: descricao };

    try {
        let response;
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
            alert("Erro ao salvar tarefa.");
        }
    } catch (error) {
        console.error("Erro:", error);
    }
});

// --- LÓGICA DO MODAL DE EXCLUSÃO ---

// 1. Quando clica no botão "Sim, Excluir" do modal
btnConfirmarExclusao.addEventListener('click', async () => {
    if (!idParaExcluir) return;

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const response = await fetch(`${BASE_URL}/tasks/${idParaExcluir}`, {
            method: 'DELETE',
            headers: headers
        });

        if (response.status === 204) {
            fetchItems(); // Recarrega a lista
            fecharModal(); // Esconde o modal
        } else {
            alert("Erro ao excluir.");
        }
    } catch (error) {
        console.error("Erro ao excluir:", error);
    }
});

// 2. Quando clica no botão "Cancelar"
btnCancelarModal.addEventListener('click', fecharModal);

// Funções para abrir e fechar
function abrirModal(id) {
    idParaExcluir = id; // Guarda o ID na variável global
    modalConfirmacao.classList.remove('hidden'); // Mostra a janelinha
}

function fecharModal() {
    idParaExcluir = null;
    modalConfirmacao.classList.add('hidden'); // Esconde a janelinha
}

// --- EVENTOS DA TABELA ---
function adicionarEventosBotoes() {
    // Botões Excluir (Lixeira)
    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Em vez de confirm(), chamamos nossa função do modal
            const id = e.target.closest('button').dataset.id;
            abrirModal(id); 
        });
    });

    // Botões Editar (Lápis)
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const botao = e.target.closest('button');
            
            inputTitulo.value = botao.dataset.title;
            inputDescricao.value = botao.dataset.description !== "null" ? botao.dataset.description : "";
            inputIdEdicao.value = botao.dataset.id;

            btnAdicionar.innerHTML = 'Atualizar <i class="fas fa-sync-alt"></i>';
            btnAdicionar.style.backgroundColor = '#007bff'; 
            
            inputTitulo.focus();
        });
    });
}

function limparFormulario() {
    inputTitulo.value = '';
    inputDescricao.value = '';
    inputIdEdicao.value = '';
    btnAdicionar.innerHTML = 'Salvar <i class="fas fa-save"></i>';
    btnAdicionar.style.backgroundColor = '#543271'; 
}

document.addEventListener('DOMContentLoaded', fetchItems);