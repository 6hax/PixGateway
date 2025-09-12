import "dotenv/config";

async function cancelPayment(paymentId) {
    if (!paymentId) {
        throw new Error("ID do pagamento é obrigatório");
    }

    try {
        const response = await this.PaymentGateway.cancel({
            id: paymentId.toString(),
            requestOptions: this.requestOptions,
        });

        if (!response?.id) {
            throw new Error("Resposta de cancelamento pinválida");
        }

        return {
            success: true,
            status: response.status || "cancelled",
            paymentId: response.id.toString(),
            cancellationDate: new Date().toISOString(),
        };
    } catch (error) {
        console.error(`Erro ao cancelar pagamento ${paymentId}:`, {
            error: error.message,
            stack: error.stack,
        });
        return {
            success: false,
            error: error.message,
            paymentId: paymentId.toString(),
        };
    }
}

export { cancelPayment };