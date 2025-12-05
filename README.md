# Geek Deals 

## Sobre o Projeto
A **Geek Deals** é um sistema completo de ofertas personalizadas para uma loja geek.  
A solução inclui um **backend em Node.js + MongoDB**, um **frontend web** e um **aplicativo mobile**, todos integrados no mesmo servidor.

Usuários podem se cadastrar, realizar **login com email e senha**, e visualizar produtos geek que podem estar em promoção conforme seus interesses.

---

## Funcionalidades Principais

### Backend (Node.js + MongoDB)
- Cadastro de usuários (nome, CPF, email, senha)
- Login com email + senha
- Emissão de token JWT para rotas autenticadas
- Proteção de rotas privadas com middleware
- CRUD de produtos geek contendo:
  - nome  
  - tipo  
  - preço  
  - descrição  
  - data de validade  
- Separação clara:
  - controllers
  - routers
  - models
  - middlewares
- Middleware para filtragem de requisições

---

### Frontend Web
- Tela de cadastro de usuários
- Login com email e senha
- Home exibindo lista de produtos
- Interface simples e responsiva

---

### Aplicativo Mobile (Expo / React Native)
- Login com email e senha
- Home exibindo lista de produtos consumidos da API
- Interface objetiva e funcional

---

## Tecnologias Utilizadas

### Backend
- Node.js  
- Express  
- MongoDB + Mongoose  
- JWT  
- Bcrypt  
- Middlewares customizados  

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
Os seguintes diagramas acompanham o projeto, conforme solicitado pelo professor:

- **Diagrama de Casos de Uso**
- **Diagrama de Classes (backend)**
- **Diagrama de Sequência – Login + 2FA (simulação apenas)**

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
```bash
cd backend
npm install
cp .env.example .env
npm start
```
Backend disponível em:
http://localhost:3000

### Frontend
```
cd frontend-web
npm install
npm start
```

### Mobile
```
cd mobile
npm install
npx expo start
```

## Testes Manuais Recomendados

### Backend
- Registrar novo usuário  
- Login com email/senha → receber token JWT  
- Acessar rota protegida `/products` usando o token  
- Criar, listar, atualizar e deletar produtos autenticado  

### Frontend Web
- Realizar cadastro  
- Fazer login  
- Visualizar produtos na Home  

### Mobile
- Logar no app mobile  
- Visualizar produtos carregados da API  

---

## Equipe
- **Bruna** – Backend  
- **Ithalo** – Serviços e suporte às integrações  
- **Felipe** – Frontend Web  
- **Neto** – Mobile + Documentação  


