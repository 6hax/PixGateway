export const createPayment = async (req, res) => {
  const { amount, description } = req.body;
  try {
    const result = await req.payment.createPayment(amount, description);

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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

export const checkApproved = async (req, res) => {
  try {
    const result = await req.payment.checkApprovedPayment(
      req.params.paymentId,
      req.params.preferenceId
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const cancelPayment = async (req, res) => {
  try {
    const result = await req.payment.cancelPayment(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
