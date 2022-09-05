import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "./product.entity";

const expectedId = new Id("p1");
const expectedName = "Product 1";
const expectedPrice = 30;

describe("Product unit tests", () => {

    it("should throw an error when name is empty", () => {
        expect(() => {
            const product = new Product({
                id: expectedId,
                name: "",
                price: expectedPrice
            })
        }).toThrowError("Name is required")
    });

    it("should throw an error when price is zero", () => {
        expect(() => {
            const product = new Product({
                id: expectedId,
                name: expectedName,
                price: 0
            })
        }).toThrowError("Price must be greater than zero")
    });

    it("should create a product", () => {
        // given when
        const product = new Product({
            id: expectedId,
            name: expectedName,
            price: expectedPrice
        });

        // then
        expect(product.id).toStrictEqual(expectedId);
        expect(product.name).toBe(expectedName);
        expect(product.price).toBe(expectedPrice);

        expect(product.createdAt).toBeDefined();
        expect(product.updatedAt).toBeDefined();
    });
});