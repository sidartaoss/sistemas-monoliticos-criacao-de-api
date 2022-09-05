import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for checkout", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    it("should place an order", async () => {
        // given
        const responseClient = await request(app)
            .post("/clients")
            .send({
                name: "Client 1",
                email: "client1@client.com",
                document: "000000",
                street: "Rua Abc",
                number: "012",
                complement: "AP",
                city: "Caxias do Sul",
                state: "Rio Grande do Sul",
                zipCode: "93000333"
            });

        expect(responseClient.status).toBe(200);
        expect(responseClient.body.id).toBeDefined();
        expect(responseClient.body.name).toBe("Client 1");
        expect(responseClient.body.email).toBe("client1@client.com");
        expect(responseClient.body.document).toBe("000000");
        expect(responseClient.body.street).toBe("Rua Abc");
        expect(responseClient.body.number).toBe("012");
        expect(responseClient.body.complement).toBe("AP");
        expect(responseClient.body.city).toBe("Caxias do Sul");
        expect(responseClient.body.state).toBe("Rio Grande do Sul");
        expect(responseClient.body.zipCode).toBe("93000333");
        expect(responseClient.body.createdAt).toBeDefined();
        expect(responseClient.body.updatedAt).toBeDefined();

        const product1Response = await request(app)
                .post("/products")
                .send({
                    name: "Product 1",
                    description: "Some Product 1",
                    purchasePrice: 39.9,
                    salesPrice: 59.9,
                    stock: 10
        });

        expect(product1Response.status).toBe(200);
        expect(product1Response.body.id).toBeDefined();
        expect(product1Response.body.name).toBe("Product 1");
        expect(product1Response.body.description).toBe("Some Product 1");
        expect(product1Response.body.purchasePrice).toBe(39.9);
        expect(product1Response.body.salesPrice).toBe(59.9);
        expect(product1Response.body.stock).toBe(10);
        expect(product1Response.body.createdAt).toBeDefined();
        expect(product1Response.body.updatedAt).toBeDefined();

        const product2Response = await request(app)
                .post("/products")
                .send({
                    name: "Product 2",
                    description: "Some Product 2",
                    purchasePrice: 49.9,
                    salesPrice: 69.9,
                    stock: 10
        });

        expect(product2Response.status).toBe(200);
        expect(product2Response.body.id).toBeDefined();
        expect(product2Response.body.name).toBe("Product 2");
        expect(product2Response.body.description).toBe("Some Product 2");
        expect(product2Response.body.purchasePrice).toBe(49.9);
        expect(product2Response.body.salesPrice).toBe(69.9);
        expect(product2Response.body.stock).toBe(10);
        expect(product2Response.body.createdAt).toBeDefined();
        expect(product2Response.body.updatedAt).toBeDefined();

        const expectedStatus = "approved";
        const expectedTotal = product1Response.body.salesPrice + product2Response.body.salesPrice;

        // when 
        const response = await request(app)
                .post("/checkouts")
                .send({
                    clientId: responseClient.body.id,
                    products: [{productId: product1Response.body.id}, {productId: product2Response.body.id}]
                });

        // then
        expect(response.status).toBe(200);

        expect(response.body.id).toBeDefined();
        expect(response.body.invoiceId).toBeDefined();
        expect(response.body.status).toEqual(expectedStatus);
        expect(response.body.total).toEqual(expectedTotal);

        expect(response.body.products).toBeDefined();
        expect(response.body.products.length).toEqual(2);
        expect(response.body.products[0].productId).toEqual(product1Response.body.id);
        expect(response.body.products[1].productId).toEqual(product2Response.body.id);
    });

    it("should not place an order", async () => {
        // given when
        const response = await request(app)
                .post("/checkouts")
                .send({
                    clientId: "c1"
                });
        expect(response.status).toEqual(500);
    });
});