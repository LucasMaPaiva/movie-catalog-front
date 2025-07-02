# 🎬 Cine Art: Catálogo de Filmes

Este repositório contém o código-fonte da aplicação **Cine Art**, um catálogo de filmes interativo que permite aos usuários explorar, pesquisar e gerenciar suas coleções de filmes favoritos. A aplicação é composta por um **backend robusto em Laravel** e um **frontend dinâmico em Vue.js**.

Link do repositório do back
https://github.com/LucasMaPaiva/movie-catalog-api
---

---

## ✨ Visão Geral do Projeto e Funcionalidades

O **Cine Art** oferece um conjunto de funcionalidades voltadas à experiência do usuário com um catálogo de filmes:

### 🔐 Autenticação de Usuário
- Funcionalidades essenciais de registro e login.

### 🔎 Busca de Filmes
- Pesquise filmes pelo nome.
- Integração com a API do **The Movie Database (TMDB)**.

### ⭐ Gerenciamento de Filmes Favoritos
- **Adicionar**: Marque filmes de interesse para sua lista de favoritos (armazenamento local).
- **Visualizar**: Tela dedicada para exibir sua lista de filmes favoritos.
- **Filtrar por Gênero**: Opção para refinar a lista de favoritos por gênero.
- **Remover**: Desmarque filmes da sua lista de favoritos.

---

## ⚙️ Tecnologias Utilizadas

### Backend
- **Laravel** – Framework PHP para construção da API.
- **MySQL** – Banco de dados relacional.

### Frontend
- **Vue.js 3** – Framework JavaScript para construção de SPA (Single Page Application).
- **Pinia** – Gerenciador de estado moderno para Vue.js.
- **Tailwind CSS** – Framework utilitário para estilização.

### Ambiente
- **Docker & Docker Compose** – Utilizados para containerização dos serviços e facilitar o setup.

---

## 🚀 Como Configurar e Executar Localmente com Docker

Siga os passos abaixo para iniciar a aplicação em seu ambiente de desenvolvimento local:

### 1. Clonar o Repositório

```bash

git clone git@github.com:LucasMaPaiva/movie-catalog-front.git
cd movie-catalog-api
```

### 2. Configurar Variáveis de Ambiente

Crie uma cópia do arquivo .env.example e renomeie para .env:

```bash

cp .env.example .env
```


### 3. Instalar as Dependências

Execute o comando:

```bash

make install
```
---