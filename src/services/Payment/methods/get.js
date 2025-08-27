import "dotenv/config";

async function getPreferenceData(preferenceId) {
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
async function getPaymentData(paymentId) {
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

export { getPaymentData, getPreferenceData };
