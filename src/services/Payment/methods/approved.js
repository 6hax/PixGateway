import "dotenv/config";

async function checkApprovedPayment(paymentId, preferenceId) {
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

export { checkApprovedPayment };