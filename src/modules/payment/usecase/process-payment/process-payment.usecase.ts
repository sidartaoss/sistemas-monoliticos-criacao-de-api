import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Transaction from "../../domain/transaction";
import PaymentGateway from "../../gateway/payment.gateway";
import { InputProcessPaymentUseCaseDto, OutputProcessPaymentUseCaseDto } from "./process-payment.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface {

    private _transactionRepository: PaymentGateway;

    constructor(transactionRepository: PaymentGateway) {
        this._transactionRepository = transactionRepository;
    }

    async execute(input: InputProcessPaymentUseCaseDto): Promise<OutputProcessPaymentUseCaseDto> {
        const transaction = new Transaction({
            orderId: input.orderId,
            amount: input.amount
        });

        transaction.process();

        const persistedTransaction = await this._transactionRepository.save(transaction);
        return {
            transactionId: persistedTransaction.id.id,
            orderId: persistedTransaction.orderId,
            amount: persistedTransaction.amount,
            status: persistedTransaction.status,
            createdAt: persistedTransaction.createdAt,
            updatedAt: persistedTransaction.updatedAt
        };
    }
}