import { Sequelize } from "sequelize-typescript";
import PaymentFacadeFactory from "../factory/payment.facade.factory";
import TransactionModel from "../repository/transaction.model";

describe("Payment Facade tests", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([TransactionModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should process an approved payment", async () => {
        // const transactionRepository = new TransactionRepository();
        // const processPaymentUseCase = new ProcessPaymentUseCase(transactionRepository);
        // const paymentFacade = new PaymentFacade(processPaymentUseCase);

        const paymentFacade = PaymentFacadeFactory.create();

        const input = {
            orderId: "1",
            amount: 100
        }

        const output = await paymentFacade.process(input);

        expect(output).toBeDefined();

        expect(output.transactionId).toBeDefined();
        expect(output.orderId).toBe("1")

        expect(output.amount).toBe(100);

        expect(output.status).toBe("approved");

        expect(output.createdAt).toBeDefined();
        expect(output.updatedAt).toBeDefined();
    });

    it("should process a declined payment", async () => {
        // const transactionRepository = new TransactionRepository();
        // const processPaymentUseCase = new ProcessPaymentUseCase(transactionRepository);
        // const paymentFacade = new PaymentFacade(processPaymentUseCase);

        const paymentFacade = PaymentFacadeFactory.create();

        const input = {
            orderId: "1",
            amount: 99
        }

        const output = await paymentFacade.process(input);

        expect(output).toBeDefined();

        expect(output.transactionId).toBeDefined();
        expect(output.orderId).toBe("1")

        expect(output.amount).toBe(99);

        expect(output.status).toBe("declined");

        expect(output.createdAt).toBeDefined();
        expect(output.updatedAt).toBeDefined();
    });

});