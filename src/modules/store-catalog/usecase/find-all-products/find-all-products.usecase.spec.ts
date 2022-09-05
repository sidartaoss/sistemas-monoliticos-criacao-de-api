import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindAllProductsUseCase from "./find-all-products.usecase";

const product = new Product({
    id: new Id("1"),
    name: "Product 1",
    description: "Some Product 1",
    salesPrice: 89.99
});

const product2 = new Product({
    id: new Id("2"),
    name: "Product 2",
    description: "Some Product 2",
    salesPrice: 79.99
});

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2]))
    }
};

describe("Find all products use case tests", () => {

    it("should find all products", async () => {

        const productRepository = MockRepository();
        const findAllProductsUseCase = new FindAllProductsUseCase(productRepository);

        const result = await findAllProductsUseCase.execute({});

        expect(productRepository.findAll).toHaveBeenCalled();
        expect(result.products.length).toBe(2);
        expect(result.products[0].id).toBe("1");
        expect(result.products[0].name).toBe("Product 1");
        expect(result.products[0].description).toBe("Some Product 1");
        expect(result.products[0].salesPrice).toBe(89.99);
        expect(result.products[1].id).toBe("2");
        expect(result.products[1].name).toBe("Product 2");
        expect(result.products[1].description).toBe("Some Product 2");
        expect(result.products[1].salesPrice).toBe(79.99);

    })

});