import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import ProductRepository from "./product.repository";

describe("Product Repository tests", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find all products", async () => {

        await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Some Product 1",
            purchasePrice: 69.99,
            salesPrice: 99.99,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await ProductModel.create({
            id: "2",
            name: "Product 2",
            description: "Some Product 2",
            purchasePrice: 99.99,
            salesPrice: 109.99,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const productRepository = new ProductRepository();

        const products = await productRepository.findAll();

        expect(products.length).toBe(2);

        expect(products[0].id.id).toBe("1");
        expect(products[0].name).toBe("Product 1");
        expect(products[0].description).toBe("Some Product 1");
        expect(products[0].salesPrice).toBe(99.99);

        expect(products[1].id.id).toBe("2");
        expect(products[1].name).toBe("Product 2");
        expect(products[1].description).toBe("Some Product 2");
        expect(products[1].salesPrice).toBe(109.99);
    });

    it("should find a product",async () => {
        
        await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Some Product 1",
            purchasePrice: 69.99,
            salesPrice: 99.99,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const productRepository = new ProductRepository();
        const product = await productRepository.find("1");

        expect(product.id.id).toBe("1");
        expect(product.name).toBe("Product 1");
        expect(product.description).toBe("Some Product 1");
        expect(product.salesPrice).toBe(99.99);

    });

});