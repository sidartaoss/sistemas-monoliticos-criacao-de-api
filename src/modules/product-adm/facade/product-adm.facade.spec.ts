import { Sequelize } from "sequelize-typescript";
import ProductAdmFacadeFactory from "../factory/facade.factory";
import ProductModel from "../repository/product.model";

describe("Produt Adm Facade tests", () => {

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

    it("should add a product", async () => {

        // const productRepository = new ProductRepository();
        // const addProductUseCase = new AddProductUseCase(productRepository);

        // const productAdmFacade = new ProductAdmFacade({
        //     addProductUseCase: addProductUseCase,
        //     checkStockUseCase: undefined
        // });

        const productAdmFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: "1",
            name: "Product 1",
            description: "Some Product 1",
            purchasePrice: 39.9,
            salesPrice: 59.9,
            stock: 99
        }

        const output = await productAdmFacade.addProduct(input);

        expect(output).toBeDefined();
        expect(output.id).toBe("1");
        expect(output.name).toBe("Product 1");
        expect(output.description).toBe("Some Product 1");
        expect(output.purchasePrice).toBe(39.9);
        expect(output.salesPrice).toBe(59.9);
        expect(output.stock).toBe(99);
        expect(output.createdAt).toBeDefined();
        expect(output.updatedAt).toBeDefined();

        const product = await ProductModel.findOne({
            where: { id: input.id }
        });

        expect(product).toBeDefined();
        expect(product.name).toBe("Product 1");
        expect(product.description).toBe("Some Product 1");
        expect(product.purchasePrice).toBe(39.9);
        expect(product.salesPrice).toBe(59.9);
        expect(product.stock).toBe(99);
        expect(product.createdAt).toBeDefined();
        expect(product.updatedAt).toBeDefined();
    });

    it("should check stock of a product", async () => {

        const productAdmFacade = ProductAdmFacadeFactory.create();
        const input = {
            id: "1",
            name: "Product 1",
            description: "Some Product 1",
            purchasePrice: 39.9,
            salesPrice: 59.9,
            stock: 99
        }

        const output = await productAdmFacade.addProduct(input);

        expect(output).toBeDefined();
        expect(output.id).toBe("1");
        expect(output.name).toBe("Product 1");
        expect(output.description).toBe("Some Product 1");
        expect(output.purchasePrice).toBe(39.9);
        expect(output.salesPrice).toBe(59.9);
        expect(output.stock).toBe(99);
        expect(output.createdAt).toBeDefined();
        expect(output.updatedAt).toBeDefined();

        const result = await productAdmFacade.checkStock({
            productId: "1"
        });

        expect(result.productId).toBe("1");
        expect(result.stock).toBe(99);
    });

});