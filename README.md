# LunaPay API

API em Node.js/Express para integração com Mercado Pago (PIX). Inclui autenticação via Bearer token, rate limiting e documentação completa.

## 🚀 Tecnologias

- **Node.js** (ES Modules)
- **Express 5.1.0**
- **Mercado Pago SDK**
- **Rate Limiting** (100 req/15min)

## 📁 Estrutura

```
src/
├─ server.js                    # Servidor Express
├─ config/                      # Configurações
├─ controllers/                 # Controllers da API
├─ middlewares/                 # Autenticação e Rate Limiting
├─ routes/                      # Definição de rotas
└─ services/                    # Integração Mercado Pago
```

## ⚙️ Instalação

```bash
npm install
npm run dev
```

## 🔧 Configuração

Crie um arquivo `.env`:

```env
PORT=3000
BASE_URL=http://localhost:3000
```

## 📡 Endpoints

**Base URL:** `http://localhost:3000/api`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/payment` | Criar pagamento PIX |
| GET | `/payment/:id` | Obter pagamento |
| GET | `/preference/:id` | Obter preferência |
| GET | `/check/all/:paymentId/:preferenceId` | Verificar aprovação |
| POST | `/cancel/:id` | Cancelar pagamento |
| POST | `/webhook` | Webhook (sem auth) |

## 🔐 Autenticação

Todas as rotas (exceto webhook) exigem:

```
Authorization: Bearer SEU_ACCESS_TOKEN_MERCADO_PAGO
```
## 🧪 Scripts de Teste

```bash
# Testar rate limiting
node scripts/testeRateLimit.js

# Scripts shell (edite as variáveis primeiro)
./scripts/create_payment.sh
./scripts/get_payment.sh
./scripts/check_approved.sh
./scripts/cancel_payment.sh
```

## Author


hax

