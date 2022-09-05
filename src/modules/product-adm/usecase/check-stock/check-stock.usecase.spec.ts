import { json } from "sequelize/types";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUseCase from "./check-stock.usecase";

const product = new Product({
    id: new Id("1"),
    name: "Product 1",
    description: "Some Product 1",
    purchasePrice: 39.9,
    salesPrice: 59.9,
    stock: 99
});

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        add: jest.fn()
    }
}

describe("Check Stock Use Case unit tests", () => {

    it("should get stock of a product", async () => {

        const productRepository = MockRepository();
        const checkStockUseCase = new CheckStockUseCase(productRepository);

        const input = {
            productId: "1",
        }

        const result = await checkStockUseCase.execute(input);

        expect(productRepository.find).toHaveBeenCalled();
        expect(result.productId).toBe("1");
        expect(result.stock).toBe(99);
    });

});