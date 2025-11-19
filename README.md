# APS: Sistema de Lista de Compras Full Stack

Este repositório contém o desenvolvimento da Atividade Prática Supervisionada (APS) da disciplina de **Desenvolvimento Front-End**.

O projeto consiste em uma aplicação web completa onde o usuário pode criar uma conta, fazer login e gerenciar uma **Lista de Compras** (calculadora de itens), conectada a um servidor Back-end pré-existente em Python.

## 👥 Autores

* **@Maria551751**
* **@oJohnnykkk**
* **Anshbjnhs**
---

## 🚀 Funcionalidades

A camada cliente (Front-end) possui três páginas principais interligadas:

1.  **Registro (`/client/registro`)**: Cadastro de novos usuários (Nome, E-mail, Senha).
2.  **Login (`/client/login`)**: Autenticação segura com Token.
3.  **Dashboard/Lista (`/client/tarefas`)**: 
    * Adicionar itens com Nome, Preço e Quantidade.
    * Cálculo automático do total por item e total geral.
    * Exclusão de itens.
    * Persistência de dados no servidor.

---

## 🛠️ Estrutura do Projeto

* `todo-list/server/`
    * **Back-end:** API desenvolvida em Python com FastAPI e SQLAlchemy.
    * Gerencia o banco de dados SQLite (`todos.db`).
* `client/`
    * **Front-end:** Páginas HTML, SCSS e JavaScript.
    * Estruturado em pastas independentes: `login`, `registro` e `tarefas` (dashboard).

---

## 🏃‍♀️ Como Executar o Projeto

Para a aplicação funcionar, você precisa rodar o **Servidor** e o **Front-end** simultaneamente.

### 1. Iniciando o Servidor (Back-end Python)

1.  Abra o terminal e navegue até a pasta do servidor:
    ```bash
    cd todo-list/server
    ```
2.  Crie e ative o ambiente virtual (se ainda não fez):
    ```bash
    # No Git Bash / MINGW64:
    python -m venv venv
    source venv/Scripts/activate
    ```
3.  Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Ligue o servidor:**
    ```bash
    python -m uvicorn main:app --reload
    ```
    *O servidor ficará rodando em `http://127.0.0.1:8000`.*

### 2. Iniciando o Front-end (Cliente)

1.  Abra o VS Code na pasta raiz do projeto (`teaching`).
2.  Navegue até a pasta **`client/login`** (para começar do início).
3.  Clique com o botão direito no arquivo `index.html` e escolha **"Open with Live Server"**.

---

### 🎓 Informações Acadêmicas

* **Instituição:** Centro Universitário Carioca
* **Professor:** Lucas Cordeiro Romão
* **Disciplina:** Desenvolvimento Front-End