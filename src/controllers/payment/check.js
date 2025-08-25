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