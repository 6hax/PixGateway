import rateLimit from "express-rate-limit";


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    error: "Muitas requisições, tente novamente mais tarde.",
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

export default limiter;
