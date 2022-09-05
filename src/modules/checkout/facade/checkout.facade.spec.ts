import { Sequelize } from "sequelize-typescript";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import ClientModel from "../../client-adm/repository/client.model";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import ProductModel from "../../product-adm/repository/product.model";
import StoreProductModel from "../../store-catalog/repository/product.model";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import OrderItemModel from "../repository/order-item.model";
import OrderModel from "../repository/order.model";
import OrderRepository from "../repository/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import TransactionModel from "../../payment/repository/transaction.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import InvoiceItemModel from "../../invoice/repository/invoice-item.model";
import CheckoutFacade from "./checkout.facade";

describe("Checkout Facade tests", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true}
        });

        sequelize.addModels([ClientModel, ProductModel, StoreProductModel, OrderModel, OrderItemModel, TransactionModel, InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });
    
    /*
    afterEach(async () => {
        await sequelize.close();
    })
    */

    it("should place an order", async () => {
        // given
        const clientModel = await ClientModel.create({
            id: "c1",
            name: "Client 1",
            email: "client1@client.com",
            document: "000000",
            street: "Rua Abc",
            number: "012",
            complement: "AP",
            city: "Caxias do Sul",
            state: "Rio Grande do Sul",
            zipCode: "93000333",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        expect(clientModel).toBeDefined();
        expect(clientModel.id).toBe("c1");
        expect(clientModel.name).toBe("Client 1");
        expect(clientModel.email).toBe("client1@client.com");
        expect(clientModel.document).toBe("000000");
        expect(clientModel.street).toBe("Rua Abc");
        expect(clientModel.number).toBe("012");
        expect(clientModel.complement).toBe("AP");
        expect(clientModel.city).toBe("Caxias do Sul");
        expect(clientModel.state).toBe("Rio Grande do Sul");
        expect(clientModel.zipCode).toBe("93000333");

        const productModel1 = await ProductModel.create({
                id: "p1",
                name: "Product 1",
                description: "Some Product 1",
                purchasePrice: 39.9,
                salesPrice: 59.9,
                stock: 10,
                createdAt: new Date(),
                updatedAt: new Date()
        });

        expect(productModel1).toBeDefined();
        expect(productModel1.id).toBe("p1");
        expect(productModel1.name).toBe("Product 1");
        expect(productModel1.description).toBe("Some Product 1");
        expect(productModel1.purchasePrice).toBe(39.9);
        expect(productModel1.salesPrice).toBe(59.9);
        expect(productModel1.stock).toBe(10);
        expect(productModel1.createdAt).toBeDefined();
        expect(productModel1.updatedAt).toBeDefined();

        const productModel2 = await ProductModel.create({
            id: "p2",
            name: "Product 2",
            description: "Some Product 2",
            purchasePrice: 49.9,
            salesPrice: 69.9,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        expect(productModel2).toBeDefined();
        expect(productModel2.id).toBe("p2");
        expect(productModel2.name).toBe("Product 2");
        expect(productModel2.description).toBe("Some Product 2");
        expect(productModel2.purchasePrice).toBe(49.9);
        expect(productModel2.salesPrice).toBe(69.9);
        expect(productModel2.stock).toBe(10);
        expect(productModel2.createdAt).toBeDefined();
        expect(productModel2.updatedAt).toBeDefined();

        const clientAdmFacade = ClientAdmFacadeFactory.create();
        const productAdmFacade = ProductAdmFacadeFactory.create();
        const catalogFacade = StoreCatalogFacadeFactory.create();
        const orderRepository = new OrderRepository();
        const invoiceFacade = InvoiceFacadeFactory.create();
        const paymentFacade = PaymentFacadeFactory.create();
        const placeOrderUseCase = new PlaceOrderUseCase(
            clientAdmFacade,
            productAdmFacade,
            catalogFacade,
            orderRepository,
            invoiceFacade,
            paymentFacade);
        const checkoutFacade = new CheckoutFacade({
            placeOrderUseCase: placeOrderUseCase
        });

        const expectedStatus = "approved";
        const expectedTotal = productModel1.salesPrice + productModel2.salesPrice;

        const input = {
            clientId: clientModel.id,
            products: [{productId: productModel1.id}, {productId: productModel2.id}]
        }

        // when
        const output = await checkoutFacade.placeOrder(input);

        // then
        expect(output).toBeDefined();

        expect(output.id).toBeDefined();
        expect(output.invoiceId).toBeDefined();
        expect(output.status).toEqual(expectedStatus);
        expect(output.total).toEqual(expectedTotal);

        expect(output.products).toBeDefined();
        expect(output.products.length).toEqual(2);
        expect(output.products[0].productId).toEqual(productModel1.id);
        expect(output.products[1].productId).toEqual(productModel2.id);

    });
});