import { env } from "#config"

async function createPayment(amount, description) {
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
    email: "mail@mail.com",
    first_name: "Nest",
    last_name: "Apps",
    identification: { type: "CPF", number: "94118546051" },
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
   notification_url: `${env.baseUrl}/api/webhook/`,
   payer: {
    email: "mail@mail.com",
    first_name: "Nest",
    last_name: "Apps",
    identification: { type: "CPF", number: "94118546051" },
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

export { createPayment }