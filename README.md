
# LunaPay API

![LunaPay Banner](https://img.shields.io/badge/LunaPay-PIX-blueviolet?style=for-the-badge&logo=mercadopago&logoColor=white)

> API Node.js/Express para integração com **Mercado Pago (PIX)**.  
> Inclui autenticação via **Bearer Token**, **Rate Limiting** e **documentação completa**.

---


## 📂 Estrutura do Projeto

```

src/
├─ server.js                    # Servidor Express
├─ config/                      # Configurações globais
├─ controllers/                 # Lógica dos endpoints
├─ middlewares/                 # Autenticação e Rate Limiting
├─ routes/                      # Definição das rotas
└─ services/                    # Integração com Mercado Pago

````

---

## ⚙️ Instalação

```bash
npm install
npm run dev
````

> [!NOTE]
> Usa **nodemon** no desenvolvimento para recarregar automaticamente ao salvar alterações.

---

## 🔧 Configuração

Crie um arquivo `.env` na raiz:

```env
PORT=3000
BASE_URL=http://localhost:3000
```

> [!IMPORTANT]
> Defina o token do Mercado Pago via **header Authorization**.
> Nunca armazene tokens sensíveis no código.

---

## 📡 Endpoints

**Base URL:** `http://localhost:3000/api`

| Método | Endpoint                              | Descrição                      |
| ------ | ------------------------------------- | ------------------------------ |
| `POST` | `/payment`                            | Criar pagamento PIX            |
| `GET`  | `/payment/:id`                        | Obter informações de pagamento |
| `GET`  | `/preference/:id`                     | Obter preferência de pagamento |
| `GET`  | `/check/all/:paymentId/:preferenceId` | Verificar aprovação            |
| `POST` | `/cancel/:id`                         | Cancelar pagamento             |
| `POST` | `/webhook`                            | Webhook (sem autenticação)     |

> [!TIP]
> `/webhook` é público, use apenas para notificações do Mercado Pago.

---

## 🔐 Autenticação

Adicione o header em todas as requisições (exceto webhook):

```
Authorization: Bearer SEU_ACCESS_TOKEN_MERCADO_PAGO
```

> [!IMPORTANT]
> Tokens inválidos ou ausentes retornam **401 Unauthorized**.

---

## 🧪 Scripts de Teste

```bash
# Testar limite de requisições
node scripts/testeRateLimit.js

# Scripts shell (editar variáveis primeiro)
./scripts/create_payment.sh
./scripts/get_payment.sh
./scripts/check_approved.sh
./scripts/cancel_payment.sh
```

---


## 👤 Autor

**hax**

> Building secure and modern integrations 🌙
> GitHub: [@6hax](https://github.com/6hax)


