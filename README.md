# APS: Desenvolvimento da Camada Cliente para Servidor de Lista de Tarefas

Este repositório contém o desenvolvimento da Atividade Prática Supervisionada (APS) da disciplina de **Desenvolvimento Front-End**.

O objetivo é desenvolver a camada de cliente (front-end) para um servidor de lista de tarefas (to-do list) pré-existente, integrando o sistema web a um back-end.

## 👥 Autores

* **@Maria551751**
* **@oJohnnykkk**

---

## 🚀 Funcionalidades Exigidas

Conforme a descrição da atividade, a camada cliente é composta por três páginas principais:

1.  **Página de Login**
2.  **Página de Registro de Usuários**
3.  **Página de Gestão de Tarefas** (CRUD: criação, visualização, edição e exclusão)

Toda a comunicação com o back-end é centralizada no arquivo `scripts.js` de cada página.

---

## 🛠️ Estrutura do Projeto

O repositório está organizado em duas pastas principais:

* `todo-list/server/`
    * Contém o back-end pré-existente (Python/FastAPI) fornecido pelo professor, que serve como API para a aplicação.
* `client/`
    * Contém **toda** a camada cliente (front-end) desenvolvida para esta atividade, incluindo as páginas `login`, `registro` e `tarefas`.

---

## 🏃‍♀️ Como Executar o Projeto

Para testar a aplicação completa, você precisa executar o **Back-end (servidor)** e o **Front-end (cliente)** separadamente.

### 1. Executando o Back-end (Servidor - Python)

1.  Navegue até a pasta do servidor:
    ```bash
    cd todo-list/server
    ```
2.  Crie e ative o ambiente virtual (venv):
    ```bash
    # (No Windows MINGW64/Git Bash)
    python -m venv venv
    source venv/Scripts/activate
    ```
3.  Instale as dependências (só precisa fazer isso uma vez):
    ```bash
    pip install -r requirements.txt
    ```
4.  Inicie o servidor:
    ```bash
    python -m uvicorn main:app
    ```
    *O servidor estará rodando em `http://localhost:8000`.*

### 2. Executando o Front-end (Cliente)

1.  Em **outro terminal**, abra a pasta do seu projeto no VS Code.
2.  Navegue até a pasta do front-end que deseja visualizar (ex: `client/login` ou `client/registro`).
3.  Clique com o botão direito no arquivo `index.html` e escolha **"Open with Live Server"**.
    *(Isso iniciará o front-end em `http://localhost:5500`).*

---

### Informações da Disciplina

* **Centro Universitário:** Centro Universitário Carioca
* **Professor:** Lucas Cordeiro Romão