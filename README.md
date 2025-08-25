# PayNest API — Integração Mercado Pago (PIX)

API em Node.js/Express para criação e consulta de pagamentos via Mercado Pago (com suporte a PIX), consulta de preferências, cancelamento de pagamentos e webhook para notificações. A autenticação é feita via header Authorization (Bearer) usando o Access Token do Mercado Pago.

## 🚀 Tecnologias

- **Node.js** (ES Modules)
- **Express 5.1.0**
- **Mercado Pago SDK** (`mercadopago`)
- **dotenv** para variáveis de ambiente
- **body-parser** para JSON
- **express-rate-limit** para proteção contra spam

## 📁 Estrutura do projeto

```
.
├─ src/
│  ├─ server.js                    # Inicialização do servidor Express
│  ├─ config/
│  │  ├─ index.js                  # Exportações de configuração
│  │  └─ env.js                    # Configurações de ambiente
│  ├─ controllers/
│  │  ├─ index.js                  # Exportações de controllers
│  │  └─ payment/
│  │     ├─ create.js              # Criação de pagamentos
│  │     ├─ get.js                 # Consulta de pagamentos/preferências
│  │     ├─ check.js               # Verificação de aprovação
│  │     ├─ cancel.js              # Cancelamento de pagamentos
│  │     └─ webhook.js             # Endpoint de webhook
│  ├─ middlewares/
│  │  ├─ index.js                  # Exportações de middlewares
│  │  ├─ authMiddleware.js         # Autenticação via token
│  │  └─ rateLimit.js              # Rate limiting (100 req/15min)
│  ├─ routes/
│  │  └─ routes.js                 # Definição de rotas HTTP
│  └─ services/
│     ├─ index.js                  # Exportações de serviços
│     └─ Payment.js                # Integração com Mercado Pago
├─ scripts/                         # Scripts de teste e exemplos
│  ├─ create_payment.sh            # Criar pagamento via cURL
│  ├─ get_payment.sh               # Consultar pagamento via cURL
│  ├─ get_preference.sh            # Consultar preferência via cURL
│  ├─ check_approved.sh            # Verificar aprovação via cURL
│  ├─ cancel_payment.sh            # Cancelar pagamento via cURL
│  └─ testeRateLimit.js            # Teste do rate limiter
├─ package.json
└─ README.md
```

## ⚙️ Requisitos

- **Node.js 18+** recomendado
- Acesso a um **Access Token do Mercado Pago** (produção ou sandbox)
- Opcional: Git Bash/WSL para executar os scripts `.sh` no Windows

## 🛠️ Instalação

1. **Instale as dependências:**
```bash
npm install
```

2. **Ambiente de desenvolvimento (hot reload):**
```bash
# Se você tiver o nodemon instalado globalmente
npm run dev

# Ou usando npx (caso não tenha globalmente)
npx nodemon .
```

## 🔧 Configuração de ambiente

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Porta do servidor (padrão: 3000)
PORT=3000

# URL base para webhooks (padrão: http://localhost:3000)
BASE_URL=http://localhost:3000

# Access Token do Mercado Pago (opcional, pode ser enviado via header)
# ACESSTOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx
```

### Access Token do Mercado Pago

- **Recomendado**: O middleware de autenticação lê o token do header `Authorization: Bearer <ACCESSTOKEN>` em cada requisição
- **Alternativo**: Você pode pré-definir `ACESSTOKEN` no arquivo `.env` (menos seguro)

## 🔐 Autenticação

Todas as rotas (exceto webhook) exigem o header `Authorization` no formato:

```
Authorization: Bearer <SEU_ACCESS_TOKEN_MERCADO_PAGO>
```

**Respostas de erro:**
- `401`: Header Authorization ausente ou inválido
- `429`: Rate limit excedido (100 requisições por 15 minutos)

## 🚦 Rate Limiting

A API implementa proteção contra spam com:
- **Limite**: 100 requisições por 15 minutos
- **Headers**: Inclui `X-RateLimit-*` para monitoramento
- **Resposta**: `429 Too Many Requests` quando excedido

## 📡 Endpoints

**Base URL:** `http://localhost:<PORT>/api`

### 1. Criar pagamento (PIX)
- **Método:** `POST`
- **Rota:** `/payment`
- **Autenticação:** ✅ Obrigatória
- **Corpo JSON:**
```json
{
  "amount": 50.0,
  "description": "Compra de teste"
}
```

**Resposta (201):**
```json
{
  "paymentId": "123456789",
  "preferenceId": "PREF-ABCDE",
  "preferenceUrl": "https://...",
  "pixCode": "0002012636...",
  "qrCode": "iVBORw0KGgo...",
  "data": {
    "createdAt": "2024-01-01T00:00:00.000Z",
    "status": "pending",
    "amount": 50.0,
    "description": "Compra de teste"
  }
}
```

### 2. Obter pagamento por ID
- **Método:** `GET`
- **Rota:** `/payment/:id`
- **Autenticação:** ✅ Obrigatória

**Resposta (200):**
```json
{
  "paymentId": "123456789",
  "status": "approved",
  "statusDetail": "accredited",
  "pixCode": "0002012636...",
  "qrCode": "iVBORw0KGgo...",
  "amount": 50.0,
  "currency": "BRL",
  "lastUpdated": "2024-01-01T00:00:10.000Z"
}
```

### 3. Obter preferência por ID
- **Método:** `GET`
- **Rota:** `/preference/:id`
- **Autenticação:** ✅ Obrigatória
- **Resposta:** Primeiro elemento retornado pela busca em `MerchantOrder.search`

### 4. Verificar aprovação completa
- **Método:** `GET`
- **Rota:** `/check/all/:paymentId/:preferenceId`
- **Autenticação:** ✅ Obrigatória

**Resposta (200):**
```json
{
  "paymentApproved": true,
  "preferenceApproved": true,
  "fullyApproved": true,
  "paymentStatus": "approved",
  "preferenceStatus": "paid",
  "paymentData": { "...": "..." },
  "preferenceData": { "...": "..." },
  "hasErrors": false,
  "lastChecked": "2024-01-01T00:00:30.000Z"
}
```

### 5. Cancelar pagamento
- **Método:** `POST`
- **Rota:** `/cancel/:id`
- **Autenticação:** ✅ Obrigatória

**Resposta (200):**
```json
{
  "success": true,
  "status": "cancelled",
  "paymentId": "123456789",
  "cancellationDate": "2024-01-01T00:01:00.000Z"
}
```

### 6. Webhook (notificações)
- **Método:** `POST`
- **Rota:** `/webhook`
- **Autenticação:** ❌ Não requerida
- **URL configurada:** `${BASE_URL}/api/webhook/`

**Resposta (200):** `"Webhook received"`

## 📋 Exemplos via cURL

### Configuração inicial
```bash
# Defina suas variáveis
export ACCESSTOKEN="SEU_ACCESS_TOKEN_AQUI"
export PAYMENT_ID="ID_DO_PAGAMENTO"
export PREFERENCE_ID="ID_DA_PREFERENCIA"
```

### Criar pagamento
```bash
curl -X POST http://localhost:3000/api/payment \
  -H "Authorization: Bearer $ACCESSTOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "description": "Teste PIX"
  }'
```

### Obter pagamento
```bash
curl -X GET http://localhost:3000/api/payment/$PAYMENT_ID \
  -H "Authorization: Bearer $ACCESSTOKEN" \
  -H "Content-Type: application/json"
```

### Obter preferência
```bash
curl -X GET http://localhost:3000/api/preference/$PREFERENCE_ID \
  -H "Authorization: Bearer $ACCESSTOKEN" \
  -H "Content-Type: application/json"
```

### Verificar aprovação
```bash
curl -X GET http://localhost:3000/api/check/all/$PAYMENT_ID/$PREFERENCE_ID \
  -H "Authorization: Bearer $ACCESSTOKEN" \
  -H "Content-Type: application/json"
```

### Cancelar pagamento
```bash
curl -X POST http://localhost:3000/api/cancel/$PAYMENT_ID \
  -H "Authorization: Bearer $ACCESSTOKEN" \
  -H "Content-Type: application/json"
```

### Webhook
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook data"}'
```

## 🧪 Scripts de teste

### Scripts Shell (Linux/Mac/Git Bash)
Os scripts em `scripts/` permitem testar a API facilmente. **Edite as variáveis no topo de cada arquivo** antes de executar:

```bash
# Criar pagamento
./scripts/create_payment.sh

# Consultar pagamento
./scripts/get_payment.sh

# Consultar preferência
./scripts/get_preference.sh

# Verificar aprovação
./scripts/check_approved.sh

# Cancelar pagamento
./scripts/cancel_payment.sh
```

### Teste de Rate Limiting
```bash
# Testa o limite de 100 requisições por 15 minutos
node scripts/testeRateLimit.js
```

## 🔒 Segurança e Observações

### Autenticação
- O `authMiddleware` injeta o Access Token do Mercado Pago a partir do header Authorization
- Sem autenticação válida, as chamadas retornam `401 Unauthorized`
- O token é validado a cada requisição

### Rate Limiting
- Proteção contra spam: 100 requisições por 15 minutos
- Headers `X-RateLimit-*` para monitoramento
- Resposta `429` quando excedido

### Dados de Pagador
- Em `Payment.createPayment`, alguns dados estão fixos para testes
- **Ajuste conforme sua necessidade** em produção
- Configure `notification_url` para webhooks em produção

### Webhook
- Endpoint `/webhook` não requer autenticação
- Configure `BASE_URL` para receber notificações do Mercado Pago
- Implemente validação de assinatura em produção

## 📦 Scripts npm

- **`dev`**: `nodemon .` - Inicializa a API em modo desenvolvimento com hot reload

## 🌐 Imports ES6

O projeto usa imports ES6 com aliases configurados em `package.json`:

```javascript
// Exemplos de uso
import { env } from "#config";
import { limiter } from "#middlewares";
import { createPayment } from "#controllers";
import { Payment } from "#services";
```

## Author
- hax
