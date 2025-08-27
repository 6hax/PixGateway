import { Payment } from "#services";
import "dotenv/config";

export function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  try {
    process.env.ACESSTOKEN = token.replace("Bearer ", "");
    req.payment = new Payment();
    next();
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}
