import express from "express";
import bodyParser from "body-parser";
import paymentRoutes from "./routes/routes.js";
import { env } from "./config/env.js";

const app = express();
app.use(bodyParser.json());
app.use("/api", paymentRoutes);

app.listen(env.port, () => {
  console.log(`API rodando em http://localhost:${env.port}`);
});
function hexToInt(hex) {
  return parseInt(hex.replace('#', ''), 16);
}

export const colors = {

  main: hexToInt('#ffffff'),
  

  green: hexToInt('#00FF00'),
  red: hexToInt('#FF0000'),
  blue: hexToInt('#0000FF'),
  yellow: hexToInt('#FFFF00'),
  cyan: hexToInt('#00FFFF'),
  magenta: hexToInt('#FF00FF'),
  black: hexToInt('#000000'),
  white: hexToInt('#FFFFFF'),


  primary: hexToInt('#3b82f6'),
  secondary: hexToInt('#4f545c'),
  success: hexToInt('#22c55e'),
  danger: hexToInt('#ED4245'),
  info: hexToInt('#FEE75C'),
  warning: hexToInt('#fbbd23'),


  magic: hexToInt('#C026D3'),
  fuchsia: hexToInt('#EB459E'),
  azoxo: hexToInt('#5865F2'),
  coral: hexToInt('#FF7F50'),
  lavender: hexToInt('#E6E6FA'),
  teal: hexToInt('#008080'),


  developer: hexToInt('#3e70dd'),
  balance: hexToInt('#45ddc0'),
  brilliance: hexToInt('#f07d5f'),
  creativity: hexToInt('#FFA500'),
  wisdom: hexToInt('#6A5ACD'),
  energy: hexToInt('#FF4500'),


  nitro: hexToInt('#ff6bfa'),
  bravery: hexToInt('#9c84ef'),
  invisible: hexToInt('#2c2c34'),
  gold: hexToInt('#FFD700'),
  silver: hexToInt('#C0C0C0'),
  bronze: hexToInt('#CD7F32'),


  gray50: hexToInt('#F9FAFB'),
  gray100: hexToInt('#F3F4F6'),
  gray200: hexToInt('#E5E7EB'),
  gray300: hexToInt('#D1D5DB'),
  gray400: hexToInt('#9CA3AF'),
  gray500: hexToInt('#6B7280'),
  gray600: hexToInt('#4B5563'),
  gray700: hexToInt('#374151'),
  gray800: hexToInt('#1F2937'),
  gray900: hexToInt('#111827')
};
