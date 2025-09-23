import { Payment } from "#services";
import "dotenv/config";

export function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  try {
    req.payment = new Payment(token.replace("Bearer ", ""));
    next();
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}
