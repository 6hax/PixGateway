export const createPayment = async (req, res) => {
  const { amount, description } = req.body;
  try {
    const result = await req.payment.createPayment(amount, description);

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
 