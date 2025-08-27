import { createPayment, getPaymentData, getPreferenceData, checkApprovedPayment, cancelPayment } from "./methods/index.js"
import { MercadoPagoConfig, MerchantOrder, Payment as PaymentGateway, Preference } from "mercadopago";
import "dotenv/config";

export class Payment {
 constructor() {
  if (!process.env.ACESSTOKEN) {
   throw new Error("Access Token do Mercado Pago não configurado");
  }

  this.client = new MercadoPagoConfig({
   accessToken: process.env.ACESSTOKEN,
  });

  this.PaymentGateway = new PaymentGateway(this.client);
  this.Preference = new Preference(this.client);
  this.Merchant = new MerchantOrder(this.client);

  this.requestOptions = {
   idempotencyKey: `unique-key-${Date.now()}`
  };
 }

 async createPayment(amount, description) {
  return await createPayment.call(this, amount, description);
 }

 async getPaymentData(paymentId) {
  return await getPaymentData.call(this, paymentId);
 }

 async getPreferenceData(preferenceId) {
  return await getPreferenceData.call(this, preferenceId);
 }

 async checkApprovedPayment(paymentId, preferenceId) {
  return await checkApprovedPayment.call(this, paymentId, preferenceId);
 }

 async cancelPayment(paymentId) {
  return await cancelPayment.call(this, paymentId);
 }

}
