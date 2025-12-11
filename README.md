# Geek Deals

## Sobre o Projeto

A **Geek Deals** é um sistema completo de ofertas personalizadas para uma loja geek.  
A solução inclui um **backend em Node.js + MongoDB**, um **frontend web** e um **aplicativo mobile**, todos integrados no mesmo servidor.

Usuários podem se cadastrar, realizar **login com autenticação em duas etapas (2FA por email)**, e visualizar produtos geek filtrados por categoria.

---

## Funcionalidades Principais

### Backend (Node.js + MongoDB)
- Cadastro de usuários (nome, CPF, email, senha)
- **Login com 2FA** (código de 6 dígitos enviado por email)
- Emissão de token JWT para rotas autenticadas
- Proteção de rotas privadas com middleware
- CRUD de produtos geek contendo:
  - nome
  - tipo (game, hardware, collectible, accessory)
  - preço
  - descrição
  - data de validade
- Envio de emails com Nodemailer (Ethereal em dev, SMTP em prod)

---

### Frontend Web
- Tela de cadastro de usuários
- Login com email, senha e **verificação 2FA**
- Home com lista de produtos e **filtros por categoria**
- Layout desktop-friendly com sidebar
- Interface responsiva (dark theme, glassmorphism)

---

### Aplicativo Mobile (Expo / React Native)
- Login com email, senha e **verificação 2FA**
- Home com lista de produtos consumidos da API
- **Filtros por categoria** (chips horizontais)
- Pull-to-refresh para atualizar ofertas
- Interface moderna com gradientes e animações

---

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt
- Nodemailer (emails 2FA)
- Ethereal Email (ambiente de desenvolvimento)

### Frontend Web
- HTML5
- CSS3 (design system customizado)
- JavaScript (Vanilla)
- Fetch API

### Mobile
- React Native
- Expo
- Axios
- React Navigation
- AsyncStorage

---

## Diagramas do Sistema

Os diagramas estão documentados em [DIAGRAMS.md](./DIAGRAMS.md):

- **Diagrama de Casos de Uso**
- **Diagrama de Classes**
- **Diagrama de Sequência – Login com 2FA**
- **Diagrama de Sequência – Visualizar Ofertas**
- **Arquitetura do Sistema**

---

## Estrutura do Projeto

```
GeekDeals/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── styles.css
│   └── app.js
│
├── mobile/
│   ├── App.js
│   ├── src/
│   │   ├── screens/
│   │   ├── contexts/
│   │   └── services/
│   └── package.json
│
├── DIAGRAMS.md
└── README.md
```

---

## Como Rodar o Projeto

### Backend
```bash
cd backend
npm install
npm run dev
```
Backend disponível em: http://localhost:3000

> Em desenvolvimento, os códigos 2FA são exibidos no console e podem ser visualizados no link do Ethereal Email.

### Frontend Web
```bash
cd frontend
npx serve .
```
Frontend disponível em: http://localhost:3000 (ou porta alternativa)

### Mobile
```bash
cd mobile
npm install
npx expo start
```
Escaneie o QR code com o app Expo Go no celular.

---

## Testes Recomendados

### Fluxo de Login com 2FA
1. Registrar novo usuário
2. Fazer login com email/senha
3. Receber código 2FA (ver no console do backend ou link Ethereal)
4. Inserir código na tela de verificação
5. Acessar a Home com a lista de produtos

### Filtros de Categoria
- Testar filtros: Todos, Games, Hardware, Colecionáveis, Acessórios
- Verificar contador de ofertas atualizando

---

## Equipe

- **Bruna** – Backend
- **Ithalo** – Serviços e integrações
- **Felipe** – Frontend Web
- **Neto** – Mobile + Documentação

---

**Unifacisa - 2025**
