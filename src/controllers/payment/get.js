export const getPayment = async (req, res) => {
  try {
    const result = await req.payment.getPaymentData(req.params.id);

    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
export const getPreference = async (req, res) => {
  try {
    const result = await req.payment.getPreferenceData(req.params.id);

    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};