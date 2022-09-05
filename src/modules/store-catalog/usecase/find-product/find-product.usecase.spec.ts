import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindAllProductsUseCase from "../find-all-products/find-all-products.usecase";
import FindProductUseCase from "./find-product.usecase";

const product = new Product({
    id: new Id("1"),
    name: "Product 1",
    description: "Some Product 1",
    salesPrice: 99.99
})

const MockRepository = () => {
    return {
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
    }
}

describe("Find Product Use Case unit tests", () => {

    it("should find a product", async () => {

        const productRepository = MockRepository();

        const findProductUseCase = new FindProductUseCase(productRepository);

        const input = {
            id: "1"
        }

        const result = await findProductUseCase.execute(input);

        expect(productRepository.find).toHaveBeenCalled();
        expect(result.id).toBe("1");
        expect(result.name).toBe("Product 1");
        expect(result.description).toBe("Some Product 1");
        expect(result.salesPrice).toBe(99.99);
    });

});