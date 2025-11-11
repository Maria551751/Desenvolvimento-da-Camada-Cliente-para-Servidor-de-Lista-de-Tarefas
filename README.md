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
    * Contém o back-end pré-existente fornecido pelo professor, que serve como API para a aplicação.
* `client/`
    * Contém **toda** a camada cliente (front-end) desenvolvida para esta atividade, incluindo as páginas de login, registro e gestão de tarefas.

---

## 🏃‍♀️ Como Executar o Projeto

Para testar a aplicação completa, você precisa executar o **Back-end (servidor)** e o **Front-end (cliente)** separadamente.

### 1. Executando o Back-end (Servidor)

1.  Navegue até a pasta do servidor:
    ```bash
    cd todo-list/server
    ```
2.  Instale as dependências (só precisa fazer isso uma vez):
    ```bash
    npm install
    ```
3.  Inicie o servidor:
    ```bash
    npm start
    ```
    *O servidor estará rodando em `http://localhost:3000`.*

### 2. Executando o Front-end (Cliente)

1.  Em **outro terminal**, navegue até a pasta do seu front-end (ex: a pasta de login):
    ```bash
    cd client/Frontend_login
    ```
2.  Abra o arquivo `index.html` no seu navegador.
    *(Recomenda-se usar a extensão "Live Server" do VS Code para facilitar).*

---

### Informações da Disciplina

* **Centro Universitário:** Centro Universitário Carioca
* **Professor:** Lucas Cordeiro Romão
