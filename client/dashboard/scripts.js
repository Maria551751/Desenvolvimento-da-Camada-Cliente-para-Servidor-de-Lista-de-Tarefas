// client/dashboard/scripts.js

const BASE_URL = 'http://localhost:8000';
const tasksListElement = document.getElementById('lista-de-tarefas');
const logoutButton = document.getElementById('botao-logout');

// --- UTILS ---

function getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        // Redireciona para o login se não houver token
        window.location.href = '../login/index.html';
        return null; 
    }
    // Retorna o cabeçalho de autorização exigido pelo FastAPI
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// --- LOGOUT ---

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('accessToken');
    alert('Você foi desconectado.');
    window.location.href = '../login/index.html';
});

// --- RENDERIZAÇÃO DE TAREFAS ---

function renderTasks(tasks) {
    tasksListElement.innerHTML = ''; // Limpa a lista antes de renderizar

    if (tasks.length === 0) {
        tasksListElement.innerHTML = '<li class="mensagem-vazia">Nenhuma tarefa encontrada. Adicione uma nova!</li>';
        return;
    }

    tasks.forEach(task => {
        // Cria o elemento da lista (li)
        const listItem = document.createElement('li');
        listItem.className = 'tarefa-item';
        // Armazena o ID da tarefa no próprio elemento para uso posterior (Update/Delete)
        listItem.dataset.taskId = task.id; 

        // Cria o conteúdo da tarefa
        listItem.innerHTML = `
            <div class="tarefa-info">
                <h3>${task.title}</h3>
                <p>${task.description || 'Sem descrição.'}</p>
            </div>
            <div class="tarefa-acoes">
                <button class="botao-editar" data-task-id="${task.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="botao-excluir" data-task-id="${task.id}">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        `;

        tasksListElement.appendChild(listItem);
    });
}

// --- LISTAGEM DE TAREFAS (READ) ---

async function fetchTasks() {
    const headers = getAuthHeaders();
    if (!headers) return; // Se não houver headers, a função de utilidade já redirecionou.

    try {
        const response = await fetch(`${BASE_URL}/tasks`, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            const data = await response.json();
            // data.tasks é uma lista de tarefas
            renderTasks(data.tasks); 
        } else if (response.status === 401) {
            // Token expirado ou inválido
            localStorage.removeItem('accessToken');
            alert('Sua sessão expirou. Faça login novamente.');
            window.location.href = '../login/index.html';
        } else {
            const error = await response.json();
            alert(`Erro ao carregar tarefas: ${error.detail}`);
        }
    } catch (error) {
        console.error('Erro de rede ao buscar tarefas:', error);
        alert('Não foi possível conectar ao servidor. Verifique se o back-end está ativo.');
    }
}


// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // Verifica a autenticação e carrega as tarefas ao iniciar a página
    fetchTasks();
});

const formNovaTarefa = document.getElementById('form-nova-tarefa');

// --- CRIAÇÃO DE TAREFAS (CREATE) ---

formNovaTarefa.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titleInput = document.getElementById('input-titulo-tarefa');
    const descriptionInput = document.getElementById('input-descricao-tarefa');
    
    const title = titleInput.value;
    const description = descriptionInput.value;
    // O deadline é opcional, mas poderia ser adicionado no HTML e aqui.

    // Apenas title é obrigatório
    if (!title) {
        alert("O título da tarefa é obrigatório.");
        return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    const payload = { 
        title: title, 
        description: description 
    };

    try {
        const response = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            // Sucesso (Status 201 Created)!
            alert('Tarefa adicionada com sucesso!');
            
            // Limpa o formulário
            titleInput.value = '';
            descriptionInput.value = '';

            // Recarrega a lista para mostrar a nova tarefa
            fetchTasks(); 
        } else {
            const error = await response.json();
            alert(`Erro ao criar tarefa: ${error.detail}`);
        }
    } catch (error) {
        console.error('Erro de rede ao criar tarefa:', error);
        alert('Falha na comunicação com o servidor.');
    }
});

// --- EXCLUSÃO DE TAREFAS (DELETE) ---

async function deleteTask(taskId) {
    // 1. Confirmação do usuário
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) {
        return;
    }

    const headers = getAuthHeaders();
    if (!headers) return; // Redireciona se não houver token

    try {
        // Envia a requisição DELETE para /tasks/{task_id}
        const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: headers,
        });

        if (response.status === 204) {
            // Sucesso! Status 204 No Content
            alert('Tarefa excluída com sucesso!');
            
            // Recarrega a lista para remover a tarefa excluída
            fetchTasks(); 
        } else if (response.status === 404) {
            alert('Erro: Tarefa não encontrada ou você não tem permissão para excluí-la.');
        } else {
            const error = await response.json();
            alert(`Erro ao excluir tarefa: ${error.detail}`);
        }
    } catch (error) {
        console.error('Erro de rede ao excluir tarefa:', error);
        alert('Falha na comunicação com o servidor.');
    }
}


// --- DELEGAÇÃO DE EVENTOS para botões de Ação ---

tasksListElement.addEventListener('click', (e) => {
    // Verifica se o clique foi em um botão
    const clickedButton = e.target.closest('button');

    if (!clickedButton) return;

    const taskId = clickedButton.dataset.taskId;

    if (clickedButton.classList.contains('botao-excluir')) {
        // Chama a função de exclusão
        deleteTask(taskId);
    } 
    // O código de edição será adicionado aqui, no else if
});

// --- ATUALIZAÇÃO DE TAREFAS (UPDATE) ---

async function updateTask(taskId, newTitle) {
    const headers = getAuthHeaders();
    if (!headers) return;

    const payload = { 
        title: newTitle 
        // Você poderia adicionar 'description' aqui se implementasse campos de edição mais robustos
    };

    try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: 'PUT', // O Back-end usa PUT para atualização total
            headers: headers,
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            alert('Tarefa atualizada com sucesso!');
            // Recarrega a lista para mostrar o novo título
            fetchTasks(); 
        } else if (response.status === 404) {
            alert('Erro: Tarefa não encontrada.');
        } else {
            const error = await response.json();
            alert(`Erro ao atualizar tarefa: ${error.detail}`);
        }
    } catch (error) {
        console.error('Erro de rede ao atualizar tarefa:', error);
        alert('Falha na comunicação com o servidor.');
    }
}


// --- DELEGAÇÃO DE EVENTOS (ATUALIZADA) ---

tasksListElement.addEventListener('click', (e) => {
    const clickedButton = e.target.closest('button');

    if (!clickedButton) return;

    const taskId = clickedButton.dataset.taskId;

    if (clickedButton.classList.contains('botao-excluir')) {
        deleteTask(taskId);
    } else if (clickedButton.classList.contains('botao-editar')) {
        // Lógica de Edição
        const currentTitle = clickedButton.closest('.tarefa-item').querySelector('h3').textContent;
        
        // Simplesmente pede o novo título via prompt
        const newTitle = prompt("Edite o título da tarefa:", currentTitle);

        if (newTitle && newTitle.trim() !== currentTitle.trim()) {
            // Se o usuário digitou um novo título válido
            updateTask(taskId, newTitle);
        } else if (newTitle !== null) {
            // Se o usuário clicou em OK mas não alterou nada
            alert("Nenhuma alteração foi feita.");
        }
    }
});