import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";

const transaction = new Transaction({
    id: new Id("1"),
    orderId: "1",
    status: "approved",
    amount: 100
});

const MockRepository = () => {
    return {
        save: jest.fn().mockReturnValue(Promise.resolve(transaction))
    }
}

const transaction2 = new Transaction({
    id: new Id("2"),
    orderId: "2",
    status: "declined",
    amount: 50
});

const MockRepositoryDeclined = () => {
    return {
        save: jest.fn().mockReturnValue(Promise.resolve(transaction2))
    }
}

describe("Process payment use case unit tests", () => {

    it("should approve a transaction", async () => {
        // repositorio...
        const transactionRepository = MockRepository();
        // use case...
        const processPaymentUseCase = new ProcessPaymentUseCase(transactionRepository);

        // input...
        const input = {
            orderId: "1",
            amount: 100
        };

        // output...
        const output = await processPaymentUseCase.execute(input);

        expect(transactionRepository.save).toHaveBeenCalled();

        expect(output.transactionId).toBeDefined();
        expect(output.transactionId).toBe("1");

        expect(output.orderId).toBe("1");
        expect(output.amount).toBe(100);

        expect(output.status).toBe("approved");

        expect(output.createdAt).toBeDefined();
        expect(output.updatedAt).toBeDefined();
    });

    it("should decline a transaction", async () => {
        // repositorio...
        const transactionRepository = MockRepositoryDeclined();
        // use case...
        const processPaymentUseCase = new ProcessPaymentUseCase(transactionRepository);

        // input...
        const input = {
            orderId: "2",
            amount: 50
        };

        // output...
        const output = await processPaymentUseCase.execute(input);

        expect(transactionRepository.save).toHaveBeenCalled();

        expect(output.transactionId).toBeDefined();
        expect(output.transactionId).toBe("2");

        expect(output.orderId).toBe("2");
        expect(output.amount).toBe(50);

        expect(output.status).toBe("declined");

        expect(output.createdAt).toBeDefined();
        expect(output.updatedAt).toBeDefined();
    });

});