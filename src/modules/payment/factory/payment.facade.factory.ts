import PaymentFacadeInterface from "../facade/payment.facade.interface";
import PaymentFacade from "../facade/payment.facade";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";

export default class PaymentFacadeFactory {

    static create(): PaymentFacadeInterface {
        const transactionRepository = new TransactionRepository();
        const processsPaymentUseCase = new ProcessPaymentUseCase(transactionRepository);
        const paymentFacade = new PaymentFacade(processsPaymentUseCase);
        return paymentFacade;
    }
}