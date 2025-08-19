import { MercadoPagoConfig, MerchantOrder, Payment as PaymentGateway, Preference } from "mercadopago";
import "dotenv/config";

class Payment {
 constructor() {
  if (!process.env.ACESSTOKEN) {
   throw new Error("Access Token do Mercado Pago não configurado");
  }

  this.client = new MercadoPagoConfig({
   accessToken: process.env.ACESSTOKEN,
  });

  this.PaymentGateway = new PaymentGateway(this.client);
  this.Preference = new Preference(this.client);
  this.Merchant = new MerchantOrder(this.client);

  this.requestOptions = {
   idempotencyKey: `unique-key-${Date.now()}`
  };
 }

 async createPayment(amount, description) {
  if (typeof amount !== "number" || amount <= 0) {
   throw new Error("Valor do pagamento deve ser um número positivo");
  }

  if (!description || typeof description !== "string") {
   throw new Error("Descrição do pagamento é obrigatória");
  }

  try {
   const preferenceData = {
    items: [
     {
      title: description.substring(0, 255),
      quantity: 1,
      unit_price: parseFloat(amount.toFixed(2)),
      currency_id: "BRL",
     },
    ],
    payer: {
     email: "contato.nestapps@gmail.com",
     first_name: "Nest",
     last_name: "Apps",
     identification: {
      type: "CPF",
      number: "94118546051",
     },
    },
   };

   const preference = await this.Preference.create({
    body: preferenceData,
    requestOptions: this.requestOptions,
   });

   if (!preference?.id) {
    throw new Error("Falha ao criar preferência: resposta inválida");
   }

   const paymentData = {
    transaction_amount: parseFloat(amount.toFixed(2)),
    description: description.substring(0, 255),
    payment_method_id: "pix",
    payer: {
     email: "mail@mail.com",
     first_name: "Josh",
     last_name: "Lemon",
     identification: {
      type: "CPF",
      number: "94118546051",
     },
    },
   };

   const response = await this.PaymentGateway.create({
    body: paymentData,
    requestOptions: this.requestOptions,
   });

   if (!response?.id || !response.point_of_interaction) {
    throw new Error("Falha ao criar pagamento: resposta inválida");
   }

   return {
    paymentId: response.id.toString(),
    preferenceId: preference.id.toString(),
    preferenceUrl: preference.init_point || preference.sandbox_init_point,
    pixCode: response.point_of_interaction.transaction_data?.qr_code || null,
    qrCode: response.point_of_interaction.transaction_data?.qr_code_base64 || null,
    data: {
     createdAt: new Date().toISOString(),
     status: "pending",
     amount: parseFloat(amount.toFixed(2)),
     description: description.substring(0, 255),
    },
   };
  } catch (error) {
   console.error("Erro detalhado ao criar pagamento PIX:", {
    error: error.message,
    stack: error.stack,
    amount,
    description,
   });
   throw new Error(`Falha ao processar pagamento: ${error.message}`);
  }
 }

 async getPaymentData(paymentId) {
  if (!paymentId) {
   throw new Error("ID do pagamento é obrigatório");
  }

  try {
   const response = await this.PaymentGateway.get({
    id: paymentId.toString(),
   });

   if (!response?.id) {
    throw new Error("Pagamento não encontrado");
   }

   return {
    paymentId: response.id.toString(),
    status: response.status || "unknown",
    statusDetail: response.status_detail || null,
    ...(response.point_of_interaction && {
     pixCode: response.point_of_interaction.transaction_data?.qr_code || null,
     qrCode: response.point_of_interaction.transaction_data?.qr_code_base64 || null,
    }),
    amount: response.transaction_amount || null,
    currency: response.currency_id || "BRL",
    lastUpdated: new Date().toISOString(),
   };
  } catch (error) {
   console.error(`Erro ao obter pagamento ${paymentId}:`, {
    error: error.message,
    stack: error.stack,
   });
   throw new Error(`Falha ao recuperar pagamento: ${error.message}`);
  }
 }

 async getPreferenceData(preferenceId) {
  if (!preferenceId) {
   throw new Error("ID da preferência é obrigatório");
  }

  try {
   const merchantOrders = await this.Merchant.search({
    options: {
     preference_id: preferenceId,
    },
   });

   const elements = merchantOrders.elements;
   if (!elements || elements.length === 0) {
    throw new Error("Nenhum pedido encontrado para a preferência fornecida");
   }

   return elements[0];
  } catch (error) {
   console.error(`Erro ao buscar pedido para preferência ${preferenceId}:`, {
    error: error.message,
    stack: error.stack,
   });
   throw new Error(`Falha ao recuperar pedido: ${error.message}`);
  }
 }

 async checkApprovedPayment(paymentId, preferenceId) {
  if (!paymentId || !preferenceId) {
   const errorMsg = `IDs necessários não fornecidos: paymentId=${paymentId}, preferenceId=${preferenceId}`;
   console.error(errorMsg);
   return {
    paymentApproved: false,
    preferenceApproved: false,
    fullyApproved: false,
    error: errorMsg,
    lastChecked: new Date().toISOString(),
   };
  }

  try {
   const [paymentData, preferenceData] = await Promise.all([
    this.getPaymentData(paymentId).catch((e) => ({
     error: e.message,
     status: "error",
     paymentId: paymentId.toString(),
    })),
    this.getPreferenceData(preferenceId).catch((e) => ({
     error: e.message,
     status: "error",
     preferenceId: preferenceId.toString(),
    })),
   ]);

   const approvedStatuses = {
    payment: ["approved"],
    preference: ["paid"],
   };

   const results = {
    paymentApproved: paymentData.status && approvedStatuses.payment.includes(paymentData.status),
    preferenceApproved: preferenceData.order_status && approvedStatuses.preference.includes(preferenceData.order_status),
    paymentStatus: paymentData.status || "error",
    preferenceStatus: preferenceData.status || "error",
    paymentData,
    preferenceData,
    hasErrors: paymentData.error || preferenceData.error,
   };

   return {
    ...results,
    fullyApproved: results.paymentApproved && results.preferenceApproved,
    lastChecked: new Date().toISOString(),
   };
  } catch (error) {
   console.error("Erro ao verificar pagamento:", {
    paymentId,
    preferenceId,
    error: error.message,
    stack: error.stack,
   });
   return {
    paymentApproved: false,
    preferenceApproved: false,
    fullyApproved: false,
    error: error.message,
    lastChecked: new Date().toISOString(),
   };
  }
 }

 async cancelPayment(paymentId) {
  if (!paymentId) {
   throw new Error("ID do pagamento é obrigatório");
  }

  try {
   const response = await this.PaymentGateway.cancel({
    id: paymentId.toString(),
    requestOptions: this.requestOptions,
   });

   if (!response?.id) {
    throw new Error("Resposta de cancelamento inválida");
   }

   return {
    success: true,
    status: response.status || "cancelled",
    paymentId: response.id.toString(),
    cancellationDate: new Date().toISOString(),
   };
  } catch (error) {
   console.error(`Erro ao cancelar pagamento ${paymentId}:`, {
    error: error.message,
    stack: error.stack,
   });
   return {
    success: false,
    error: error.message,
    paymentId: paymentId.toString(),
   };
  }
 }
}

export { Payment };
