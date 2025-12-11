# Geek Deals - Diagramas UML

Documentação técnica do projeto Geek Deals para a disciplina de Aplicações Web e Mobile.

---

## 1. Diagrama de Casos de Uso

```mermaid
graph TB
    subgraph Sistema["Sistema Geek Deals"]
        UC1["Fazer Login"]
        UC2["Verificar 2FA"]
        UC3["Cadastrar Conta"]
        UC4["Visualizar Ofertas"]
        UC5["Filtrar por Categoria"]
        UC6["Filtrar por Status"]
        UC7["Fazer Logout"]
        UC8["Reenviar Código 2FA"]
    end
    
    Usuario((Usuário))
    
    Usuario --> UC1
    Usuario --> UC3
    Usuario --> UC4
    Usuario --> UC5
    Usuario --> UC6
    Usuario --> UC7
    
    UC1 --> UC2
    UC2 --> UC8
```

### Descrição dos Casos de Uso

| Caso de Uso | Descrição |
|-------------|-----------|
| **Fazer Login** | Usuário entra com email e senha para acessar o sistema |
| **Verificar 2FA** | Usuário insere código de 6 dígitos enviado por email |
| **Cadastrar Conta** | Novo usuário cria conta com nome, CPF, email e senha |
| **Visualizar Ofertas** | Usuário visualiza lista de ofertas disponíveis |
| **Filtrar por Categoria** | Usuário filtra ofertas por: Games, Hardware, Colecionáveis, Acessórios |
| **Filtrar por Status** | Usuário filtra ofertas ativas ou expiradas |
| **Fazer Logout** | Usuário encerra sessão |
| **Reenviar Código 2FA** | Usuário solicita novo código de verificação |

---

## 2. Diagrama de Classes

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String name
        +String email
        +String cpf
        +String passwordHash
        +String twoFaSecret
        +Date createdAt
    }
    
    class Product {
        +ObjectId _id
        +String name
        +String description
        +Number price
        +String type
        +Date expiryDate
        +Date createdAt
    }
    
    class TwoFactorSession {
        +String tempToken
        +String code
        +String userId
        +String email
        +Date expiresAt
        +Number attempts
    }
    
    class AuthController {
        +register(req, res) void
        +login(req, res) void
        +verify2FA(req, res) void
        +resend2FA(req, res) void
    }
    
    class ProductController {
        +getAll(req, res) void
        +create(req, res) void
    }
    
    class EmailService {
        +send2FACode(email, code, name) Promise
        +createTransporter() Transporter
    }
    
    class AuthMiddleware {
        +verifyToken(req, res, next) void
    }
    
    AuthController --> User : consulta/cria
    AuthController --> TwoFactorSession : gerencia em memória
    AuthController --> EmailService : envia código
    ProductController --> Product : consulta/cria
    AuthMiddleware --> User : valida JWT
```

---

## 3. Diagrama de Sequência - Login com 2FA

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant E as Email Service
    participant DB as MongoDB
    
    U->>F: Insere email e senha
    F->>B: POST /api/auth/login
    B->>DB: Busca usuário por email
    DB-->>B: Retorna usuário
    B->>B: Valida senha (bcrypt.compare)
    B->>B: Gera código 2FA (6 dígitos)
    B->>B: Gera tempToken (random hex)
    B->>B: Armazena em Map (memória)
    B->>E: Envia email com código
    E-->>B: Email enviado
    B-->>F: {tempToken, message, expiresIn}
    F->>F: Exibe tela de verificação 2FA
    
    U->>F: Insere código 2FA
    F->>B: POST /api/auth/2fa/verify
    B->>B: Busca sessão no Map
    B->>B: Verifica expiração e tentativas
    B->>B: Compara código
    B->>B: Gera accessToken (JWT)
    B->>B: Remove sessão do Map
    B-->>F: {accessToken}
    F->>F: Salva token no localStorage
    F->>F: Redireciona para Home
```

---

## 4. Diagrama de Sequência - Visualizar Ofertas

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant M as Middleware
    participant DB as MongoDB
    
    U->>F: Acessa página de ofertas
    F->>B: GET /api/products
    Note over F,B: Header: Authorization: Bearer {token}
    B->>M: Verifica token JWT
    M->>M: Decodifica e valida token
    M-->>B: Token válido
    B->>DB: Busca todos os produtos
    DB-->>B: Lista de produtos
    B-->>F: [{product1}, {product2}, ...]
    F->>F: Renderiza cards de ofertas
    
    U->>F: Seleciona categoria "Games"
    F->>F: Filtra produtos localmente
    F->>F: Atualiza lista exibida
```

---

## 5. Arquitetura do Sistema

```mermaid
graph TB
    subgraph Cliente
        MW["Mobile (React Native)"]
        WB["Web (HTML/CSS/JS)"]
    end
    
    subgraph Servidor
        API["API REST (Express.js)"]
        AUTH["Auth Controller"]
        PROD["Product Controller"]
        MID["Auth Middleware"]
        EMAIL["Email Service"]
    end
    
    subgraph Dados
        MONGO[(MongoDB)]
        MEM["Map em Memória<br/>(2FA Sessions)"]
    end
    
    subgraph Externos
        ETH["Ethereal Email (Dev)"]
        SMTP["SMTP Server (Prod)"]
    end
    
    MW --> API
    WB --> API
    API --> AUTH
    API --> PROD
    AUTH --> MID
    PROD --> MID
    AUTH --> EMAIL
    EMAIL --> ETH
    EMAIL --> SMTP
    AUTH --> MONGO
    AUTH --> MEM
    PROD --> MONGO
```

---

## 6. Modelo de Dados

### User
```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "email": "String (required, unique)",
  "cpf": "String (required, unique)",
  "passwordHash": "String (required, bcrypt)",
  "twoFaSecret": "String (null)",
  "createdAt": "Date (default: now)"
}
```

### Product
```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "description": "String (required)",
  "price": "Number (required)",
  "type": "String (required: game|hardware|collectible|accessory)",
  "expiryDate": "Date (required)",
  "createdAt": "Date (default: now)"
}
```

---

## 7. Endpoints da API

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/api/auth/register` | Cadastro de usuário | Não |
| POST | `/api/auth/login` | Login (retorna tempToken) | Não |
| POST | `/api/auth/2fa/verify` | Verifica código 2FA | Não |
| POST | `/api/auth/2fa/resend` | Reenvia código 2FA | Não |
| GET | `/api/products` | Lista todas as ofertas | Sim (JWT) |
| POST | `/api/products` | Cria nova oferta | Sim (JWT) |

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|------------|
| **Frontend Web** | HTML5, CSS3, JavaScript |
| **Frontend Mobile** | React Native, Expo |
| **Backend** | Node.js, Express.js |
| **Banco de Dados** | MongoDB |
| **Autenticação** | JWT, bcrypt |
| **Email** | Nodemailer, Ethereal (dev) |

---

**Unifacisa - 2025**
