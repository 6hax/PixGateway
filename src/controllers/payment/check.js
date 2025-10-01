export const check = async (req, res) => {
  const { paymentId, preferenceId } = req.body;
  try {
    if (paymentId && preferenceId) {
      const result = await req.payment.checkApprovedPayment(
        paymentId,
        preferenceId
      );
      return res.status(200).json(result)
    }
    if (paymentId) {
      const result = await req.payment.checkPayment(
        paymentId
      );
      return res.status(200).json(result)
    }
    if (preferenceId) {
      const result = await req.payment.checkPreference(
        preferenceId
      );
      return res.status(200).json(result)
    }

    return res.status(400).json({ error: "parametros invalidos." });
  }
  catch (error) {
    return res.status(400).json({ error: error.message });
  }
}