import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import ClientModel from "./client.model";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import ProductModel from "./product.model";

const expectedClientId = "c1";
const expectedClientName = "Client 1";
const expectedClientEmail = "client@client.com";
const expectedClientAddress = "Rua Abc";

const expectedProduct1Id = "p1";
const expectedProduct1Name = "Product 1";
const expectedProduct1Description = "Some Product 1";
const expectedProduct1SalesPrice = 59.9;

const expectedProduct2Id = "p2";
const expectedProduct2Name = "Product 2";
const expectedProduct2Description = "Some Product 2";
const expectedProduct2SalesPrice = 69.9;

const expectedStatus = "approved";

describe("Order repository tests", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true}
        });

        sequelize.addModels([ClientModel, ProductModel, OrderModel, OrderItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should add an order", async () => {
        // given
        const client = await ClientModel.create({
            id: expectedClientId,
            name: expectedClientName,
            email: expectedClientEmail,
            address: expectedClientAddress
        });

        const product1 = await ProductModel.create({
            id: expectedProduct1Id,
            name: expectedProduct1Name,
            description: expectedProduct1Description,
            salesPrice: expectedProduct1SalesPrice
        });

        const product2 = await ProductModel.create({
            id: expectedProduct2Id,
            name: expectedProduct2Name,
            description: expectedProduct2Description,
            salesPrice: expectedProduct2SalesPrice
        });

        const order = new Order({
            client: new Client({
                id: new Id(client.id),
                name: client.name,
                email: client.email,
                address: client.address
            }),
            products: [
                    new Product({
                        id: new Id(product1.id),
                        name: product1.name,
                        description: product1.description,
                        salesPrice: product1.salesPrice
                    }),
                    new Product({
                        id: new Id(product2.id),
                        name: product2.name,
                        description: product2.description,
                        salesPrice: product2.salesPrice
                    })
            ],
            status: expectedStatus
        });

        const orderRepository = new OrderRepository();

        // when
        await orderRepository.addOrder(order);

        // then
        const orderModel = await OrderModel.findOne({
            where: { id: order.id.id },
            include: [ "items" ]
        });

        expect(orderModel).toBeDefined();

        expect(orderModel.id).toEqual(order.id.id);
        expect(orderModel.client_id).toEqual(expectedClientId);

        expect(orderModel.items).toBeDefined();
        expect(orderModel.items.length).toEqual(2);
        
        expect(orderModel.items[0].id).toBeDefined()
        expect(orderModel.items[0].product_id).toEqual(expectedProduct1Id);
        expect(orderModel.items[0].name).toEqual(expectedProduct1Name);
        expect(orderModel.items[0].price).toEqual(expectedProduct1SalesPrice);
        expect(orderModel.items[0].createdAt).toBeDefined();
        expect(orderModel.items[0].updatedAt).toBeDefined();

        expect(orderModel.items[1].id).toBeDefined();
        expect(orderModel.items[1].product_id).toEqual(expectedProduct2Id);
        expect(orderModel.items[1].name).toEqual(expectedProduct2Name);
        expect(orderModel.items[1].price).toEqual(expectedProduct2SalesPrice);
        expect(orderModel.items[1].createdAt).toBeDefined();
        expect(orderModel.items[1].updatedAt).toBeDefined();

        expect(orderModel.status).toEqual(expectedStatus);

        expect(orderModel.createdAt).toBeDefined();
        expect(orderModel.updatedAt).toBeDefined();
    });

    it("should find an order", async () => {
        // given
        const client = await ClientModel.create({
            id: expectedClientId,
            name: expectedClientName,
            email: expectedClientEmail,
            address: expectedClientAddress
        });

        const product1 = await ProductModel.create({
            id: expectedProduct1Id,
            name: expectedProduct1Name,
            description: expectedProduct1Description,
            salesPrice: expectedProduct1SalesPrice
        });

        const product2 = await ProductModel.create({
            id: expectedProduct2Id,
            name: expectedProduct2Name,
            description: expectedProduct2Description,
            salesPrice: expectedProduct2SalesPrice
        });

        const expectedOrder = new Order({
            client: new Client({
                id: new Id(client.id),
                name: client.name,
                email: client.email,
                address: client.address
            }),
            products: [
                    new Product({
                        id: new Id(product1.id),
                        name: product1.name,
                        description: product1.description,
                        salesPrice: product1.salesPrice
                    }),
                    new Product({
                        id: new Id(product2.id),
                        name: product2.name,
                        description: product2.description,
                        salesPrice: product2.salesPrice
                    })
            ],
            status: expectedStatus
        });

        const orderRepository = new OrderRepository();
        await orderRepository.addOrder(expectedOrder);

        const id = expectedOrder.id.id;

        // when
        const actualOrder = await orderRepository.findOrder(id);

        // then
        expect(actualOrder).toBeDefined();

        expect(actualOrder.id.id).toEqual(id);

        expect(actualOrder.client.id.id).toEqual(expectedClientId);
        expect(actualOrder.client.name).toEqual(expectedClientName);
        expect(actualOrder.client.email).toEqual(expectedClientEmail);
        expect(actualOrder.client.address).toEqual(expectedClientAddress);

        expect(actualOrder.products).toBeDefined();
        expect(actualOrder.products.length).toEqual(2);
        
        expect(actualOrder.products[0].id.id).toEqual(expectedProduct1Id);
        expect(actualOrder.products[0].name).toEqual(expectedProduct1Name);
        expect(actualOrder.products[0].salesPrice).toEqual(expectedProduct1SalesPrice);

        expect(actualOrder.products[1].id.id).toEqual(expectedProduct2Id);
        expect(actualOrder.products[1].name).toEqual(expectedProduct2Name);
        expect(actualOrder.products[1].salesPrice).toEqual(expectedProduct2SalesPrice);

        expect(actualOrder.status).toEqual(expectedStatus);

    });

});