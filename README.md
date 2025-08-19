## PayNest API — Integração Mercado Pago (PIX)

API em Node.js/Express para criação e consulta de pagamentos via Mercado Pago (com suporte a PIX), consulta de preferências e cancelamento de pagamentos. A autenticação é feita via header Authorization (Bearer) usando o Access Token do Mercado Pago.

### Tecnologias
- **Node.js** (ES Modules)
- **Express**
- **Mercado Pago SDK** (`mercadopago`)
- **dotenv** para variáveis de ambiente
- **body-parser** para JSON

### Estrutura do projeto
```
.
├─ src/
│  ├─ server.js                 # Inicialização do servidor Express
│  ├─ config/env.js             # Configurações de ambiente (porta)
│  ├─ controllers/paymentController.js
│  ├─ middlewares/authMiddleware.js
│  ├─ routes/paymentRoutes.js   # Rotas HTTP
│  └─ services/Payment.js       # Integração com Mercado Pago
├─ scripts/                      # Exemplos de chamadas via curl
│  ├─ create_payment.sh
│  ├─ get_payment.sh
│  ├─ get_preference.sh
│  ├─ check_approved.sh
│  └─ cancel_payment.sh
├─ package.json
└─ README.md
```

### Requisitos
- Node.js 18+ recomendado
- Acesso a um Access Token do Mercado Pago (produção ou sandbox)
- Opcional: Git Bash/WSL para executar os scripts `.sh` no Windows

### Instalação
1. Instale as dependências:
```bash
npm install
```
2. Ambiente de desenvolvimento (hot reload):
```bash
# Se você tiver o nodemon instalado globalmente
npm run dev

# Ou usando npx (caso não tenha globalmente)
npx nodemon .
```

### Configuração de ambiente
- Porta do servidor: defina `PORT` em um arquivo `.env` ou variável de ambiente. Padrão: `3000`.
- Access Token do Mercado Pago:
  - O middleware de autenticação lê o token do header `Authorization: Bearer <ACCESSTOKEN>` em cada requisição e o exporta para `process.env.ACESSTOKEN`.
  - Alternativamente, você pode pré-definir `ACESSTOKEN` no ambiente (menos recomendado, pois o projeto foi pensado para receber o token por requisição).

Exemplo de `.env` (opcional):
```env
PORT=3000
# ACESSTOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx
```

### Autenticação
Todas as rotas exigem o header `Authorization` no formato:
```
Authorization: Bearer <SEU_ACCESS_TOKEN_MERCADO_PAGO>
```
Caso o header não seja enviado ou seja inválido, a API retorna `401`.

### Endpoints
Base URL: `http://localhost:<PORT>/api`

1) Criar pagamento (PIX)
- Método: `POST`
- Rota: `/payment`
- Corpo JSON:
```json
{
  "amount": 50.0,
  "description": "Compra de teste"
}
```
- Resposta (exemplo abreviado):
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

2) Obter pagamento por ID
- Método: `GET`
- Rota: `/payment/:id`
- Resposta (exemplo abreviado):
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

3) Obter preferência por ID
- Método: `GET`
- Rota: `/preference/:id`
- Resposta: primeiro elemento retornado pela busca em `MerchantOrder.search` (objeto do Mercado Pago).

4) Verificar aprovação (pagamento + preferência)
- Método: `GET`
- Rota: `/check/:paymentId/:preferenceId`
- Resposta (exemplo abreviado):
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

5) Cancelar pagamento
- Método: `POST`
- Rota: `/cancel/:id`
- Resposta (exemplo):
```json
{
  "success": true,
  "status": "cancelled",
  "paymentId": "123456789",
  "cancellationDate": "2024-01-01T00:01:00.000Z"
}
```

### Exemplos via cURL
Todos os exemplos assumem `PORT=3000`.

Criar pagamento:
```bash
curl -X POST http://localhost:3000/api/payment \
  -H "Authorization: Bearer $ACCESSTOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "description": "Teste PIX"
  }'
```

Obter pagamento:
```bash
curl -X GET http://localhost:3000/api/payment/$PAYMENT_ID \
  -H "Authorization: Bearer $ACCESSTOKEN" \
  -H "Content-Type: application/json"
```

Obter preferência:
```bash
curl -X GET http://localhost:3000/api/preference/$PREFERENCE_ID \
  -H "Authorization: Bearer $ACCESSTOKEN" \
  -H "Content-Type: application/json"
```

Verificar aprovação:
```bash
curl -X GET http://localhost:3000/api/check/$PAYMENT_ID/$PREFERENCE_ID \
  -H "Authorization: Bearer $ACCESSTOKEN" \
  -H "Content-Type: application/json"
```

Cancelar pagamento:
```bash
curl -X POST http://localhost:3000/api/cancel/$PAYMENT_ID \
  -H "Authorization: Bearer $ACCESSTOKEN" \
  -H "Content-Type: application/json"
```

Você também pode usar os scripts no diretório `scripts/` (edite as variáveis no topo de cada arquivo `.sh`). Em Windows, execute via Git Bash.

### Observações importantes
- O `authMiddleware` injeta o Access Token do Mercado Pago a partir do header Authorization. Sem ele, as chamadas retornam 401.
- Em `Payment.createPayment`, alguns dados de pagador estão com valores fixos de exemplo e servem apenas para testes. Ajuste conforme sua necessidade e seu fluxo de checkout.
- As respostas e campos podem variar de acordo com o ambiente (sandbox vs produção) e com atualizações do SDK do Mercado Pago.

### Scripts npm
- **dev**: `nodemon .` (inicializa a API em modo desenvolvimento)

