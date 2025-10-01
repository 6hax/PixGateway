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
      getPaymentData(paymentId).catch((e) => ({
        error: e.message,
        status: "error",
        paymentId: paymentId.toString(),
      })),
      getPreferenceData(preferenceId).catch((e) => ({
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
      preferenceStatus: preferenceData.order_status || "error",
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
    console.error("Erro ao verificar pagamento:", { paymentId, preferenceId, error: error.message });
    return {
      paymentApproved: false,
      preferenceApproved: false,
      fullyApproved: false,
      error: error.message,
      lastChecked: new Date().toISOString(),
    };
  }
}


async function checkPayment(paymentId) {
  if (!paymentId) {
    const errorMsg = `paymentId não fornecido: ${paymentId}`;
    console.error(errorMsg);
    return { paymentApproved: false, error: errorMsg, lastChecked: new Date().toISOString() };
  }

  try {
    const paymentData = await getPaymentData(paymentId).catch((e) => ({
      error: e.message,
      status: "error",
      paymentId: paymentId.toString(),
    }));

    const approvedStatuses = ["approved"];
    const paymentApproved = paymentData.status && approvedStatuses.includes(paymentData.status);

    return {
      paymentApproved,
      paymentStatus: paymentData.status || "error",
      paymentData,
      hasErrors: paymentData.error,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Erro ao verificar pagamento:", { paymentId, error: error.message });
    return { paymentApproved: false, error: error.message, lastChecked: new Date().toISOString() };
  }
}


async function checkPreference(preferenceId) {
  if (!preferenceId) {
    const errorMsg = `preferenceId não fornecido: ${preferenceId}`;
    console.error(errorMsg);
    return { preferenceApproved: false, error: errorMsg, lastChecked: new Date().toISOString() };
  }

  try {
    const preferenceData = await getPreferenceData(preferenceId).catch((e) => ({
      error: e.message,
      status: "error",
      preferenceId: preferenceId.toString(),
    }));

    const approvedStatuses = ["paid"];
    const preferenceApproved = preferenceData.order_status && approvedStatuses.includes(preferenceData.order_status);

    return {
      preferenceApproved,
      preferenceStatus: preferenceData.order_status || "error",
      preferenceData,
      hasErrors: preferenceData.error,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Erro ao verificar preferência:", { preferenceId, error: error.message });
    return { preferenceApproved: false, error: error.message, lastChecked: new Date().toISOString() };
  }
}

export {
  checkApprovedPayment,
  checkPayment,
  checkPreference,
};
