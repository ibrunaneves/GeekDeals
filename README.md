# Geek Deals 

## Sobre o Projeto
A **Geek Deals** é um sistema completo de ofertas personalizadas para uma loja geek.  
A solução inclui um **backend em Node.js + MongoDB**, um **frontend web** e um **aplicativo mobile**, todos integrados.

Usuários podem se cadastrar, realizar login com **autenticação de duas etapas (2FA)** e visualizar produtos geek que podem estar em promoção conforme seus interesses.

---

## Funcionalidades Principais

### Backend (Node.js + MongoDB)
- Cadastro de usuários (nome, CPF, email, senha)
- Login com email + senha
- Autenticação em **duas etapas (2FA)** via código temporário
- Proteção de rotas com JWT
- CRUD de produtos geek (nome, tipo, preço, descrição, validade)
- Separação clara: controllers, routers, models, middlewares
- Middleware de autenticação e filtro de requisições

### Frontend Web
- Tela de cadastro
- Login em duas etapas (senha → código 2FA)
- Home com listagem de produtos
- Interface simples e responsiva

### Aplicativo Mobile (Expo / React Native)
- Login com senha + 2FA
- Home com listagem de produtos da API
- Interface objetiva e funcional

---

## Tecnologias Utilizadas

### Backend
- Node.js  
- Express  
- MongoDB + Mongoose  
- JWT  
- Bcrypt  
- Middleware customizado  
- Speakeasy (ou lógica 2FA própria)

### Frontend Web
- HTML  
- CSS / Bootstrap  
- JavaScript  
- Axios / Fetch API  

### Mobile
- React Native  
- Expo  

---

## Diagramas do Sistema
Diagramas incluídos no projeto:

- **Diagrama de Casos de Uso**
- **Diagrama de Classes (backend)**
- **Diagrama de Sequência – Login + 2FA**

---

## Estrutura Geral do Projeto

```
geek-deals/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middlewares/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── services/
│ │ └── index.js
│ ├── package.json
│ └── .env.example
│
├── frontend-web/
│ ├── public/
│ ├── src/
│ └── index.html
│
├── mobile/
│ ├── App.js
│ └── package.json
│
└── docs/
├── diagrams/
└── readme-assets/
```

---

## Como Rodar o Projeto

### Backend
bash
cd backend
npm install
cp .env.example .env
npm start

### Backend disponível em:
http://localhost:3000

### Frontend
cd frontend-web
npm install
npm start

### Mobile
cd mobile
npm install
npx expo start

---

### Testes Manuais Recomendados

Registrar novo usuário
Login com email/senha → receber tempToken
Inserir código 2FA válido → receber JWT
Acessar rota protegida /products com JWT
Visualizar listagem no frontend web
Visualizar listagem no mobile

Bruna – Backend Core  
Ithalo – Autenticação 2FA + Serviços  
Felipe – Frontend Web  
Neto – Mobile + Documentação
