import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Transaction from "../domain/transaction";
import TransactionModel from "./transaction.model";
import TransactionRepository from "./transaction.repository";

describe("Transaction Repository tests", () => {

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

    it("should save an approved transaction", async () => {
        const transactionProps = {
            id: new Id("1"),
            orderId: "1",
            amount: 100,
        }
        const transaction = new Transaction(transactionProps);
        transaction.process();

        const transactionRepository = new TransactionRepository();
        await transactionRepository.save(transaction);

        const transactionDb = await TransactionModel.findOne(
            { where: { id: transactionProps.id.id } }   
        );

        expect(transactionDb).toBeDefined();

        expect(transactionDb.id).toEqual("1");
        expect(transactionDb.orderId).toEqual("1");
        expect(transactionDb.amount).toEqual(100);

        expect(transactionDb.status).toBe("approved");

        expect(transactionDb.createdAt).toBeDefined();
        expect(transactionDb.updatedAt).toBeDefined();
    });

    it("should save a declined transaction", async () => {
        const transactionProps = {
            id: new Id("1"),
            orderId: "1",
            amount: 99
        }
        const transaction = new Transaction(transactionProps);
        transaction.process();

        const transactionRepository = new TransactionRepository();
        await transactionRepository.save(transaction);

        const transactionDb = await TransactionModel.findOne(
            { where: { id: transactionProps.id.id } }
        );

        expect(transactionDb).toBeDefined();

        expect(transactionDb.id).toEqual("1");
        expect(transactionDb.orderId).toEqual("1");
        expect(transactionDb.amount).toEqual(99);

        expect(transactionDb.status).toBe("declined");

        expect(transactionDb.createdAt).toBeDefined();
        expect(transactionDb.updatedAt).toBeDefined();
    });

});