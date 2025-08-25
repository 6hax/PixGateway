export const cancelPayment = async (req, res) => {
  try {
    const result = await req.payment.cancelPayment(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
