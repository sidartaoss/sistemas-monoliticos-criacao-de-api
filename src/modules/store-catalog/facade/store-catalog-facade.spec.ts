import { Sequelize } from "sequelize-typescript";
import StoreCatalogFacadeFactory from "../factory/facade.factory";
import ProductModel from "../repository/product.model";

describe("Store Catalog Facade tests", () => {

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

    it("should find a product", async () => {

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

        const storeCatalogFacade = StoreCatalogFacadeFactory.create();

        const result = await storeCatalogFacade.find({ id: "1" });

        expect(result.id).toBe("1");
        expect(result.name).toBe("Product 1");
        expect(result.description).toBe("Some Product 1");
        expect(result.salesPrice).toBe(99.99);
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

        const storeCatalogFacade = StoreCatalogFacadeFactory.create();

        const result = await storeCatalogFacade.findAll({});

        expect(result.products.length).toBe(2);
        
        expect(result.products[0].id).toBe("1");
        expect(result.products[0].name).toBe("Product 1");
        expect(result.products[0].description).toBe("Some Product 1");
        expect(result.products[0].salesPrice).toBe(99.99);

        expect(result.products[1].id).toBe("2");
        expect(result.products[1].name).toBe("Product 2");
        expect(result.products[1].description).toBe("Some Product 2");
        expect(result.products[1].salesPrice).toBe(109.99);
    });

});