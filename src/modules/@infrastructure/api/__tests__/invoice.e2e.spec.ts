import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for invoice", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    it("should find an invoice", async () => {
        // given
        const clientResponse = await request(app)
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

        expect(clientResponse.status).toBe(200);
        expect(clientResponse.body.id).toBeDefined();
        expect(clientResponse.body.name).toBe("Client 1");
        expect(clientResponse.body.email).toBe("client1@client.com");
        expect(clientResponse.body.document).toBe("000000");
        expect(clientResponse.body.street).toBe("Rua Abc");
        expect(clientResponse.body.number).toBe("012");
        expect(clientResponse.body.complement).toBe("AP");
        expect(clientResponse.body.city).toBe("Caxias do Sul");
        expect(clientResponse.body.state).toBe("Rio Grande do Sul");
        expect(clientResponse.body.zipCode).toBe("93000333");
        expect(clientResponse.body.createdAt).toBeDefined();
        expect(clientResponse.body.updatedAt).toBeDefined();

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

        const checkoutResponse = await request(app)
            .post("/checkouts")
            .send({
                clientId: clientResponse.body.id,
                products: [{productId: product1Response.body.id}, {productId: product2Response.body.id}]
            });

        expect(checkoutResponse.status).toBe(200);

        expect(checkoutResponse.body.id).toBeDefined();
        expect(checkoutResponse.body.invoiceId).toBeDefined();
        expect(checkoutResponse.body.status).toEqual(expectedStatus);
        expect(checkoutResponse.body.total).toEqual(expectedTotal);

        expect(checkoutResponse.body.products).toBeDefined();
        expect(checkoutResponse.body.products.length).toEqual(2);
        expect(checkoutResponse.body.products[0].productId).toEqual(product1Response.body.id);
        expect(checkoutResponse.body.products[1].productId).toEqual(product2Response.body.id);

        // when
        const response = await request(app)
                .get(`/invoices/${checkoutResponse.body.invoiceId}`);

        // then
        expect(response.status).toEqual(200);

        expect(response.body.id).toEqual(checkoutResponse.body.invoiceId);
        expect(response.body.name).toEqual(clientResponse.body.name);
        expect(response.body.document).toEqual(clientResponse.body.document);

        expect(response.body.address).toBeDefined();
        expect(response.body.address.street).toEqual(clientResponse.body.street);
        expect(response.body.address.number).toEqual(clientResponse.body.number);
        expect(response.body.address.complement).toEqual(clientResponse.body.complement);
        expect(response.body.address.city).toEqual(clientResponse.body.city);
        expect(response.body.address.state).toEqual(clientResponse.body.state);
        expect(response.body.address.zipCode).toEqual(clientResponse.body.zipCode);

        expect(response.body.items).toBeDefined();
        expect(response.body.items.length).toEqual(2);

        expect(response.body.items[0].id).toEqual(product1Response.body.id);
        expect(response.body.items[0].name).toEqual(product1Response.body.name);
        expect(response.body.items[0].price).toEqual(product1Response.body.salesPrice);

        expect(response.body.items[1].id).toEqual(product2Response.body.id);
        expect(response.body.items[1].name).toEqual(product2Response.body.name);
        expect(response.body.items[1].price).toEqual(product2Response.body.salesPrice);

        expect(response.body.total).toEqual(expectedTotal);
        expect(response.body.createdAt).toBeDefined();
    });

    it("should not find an invoice", async () => {
        // give when
        const response = await request(app)
                .get(`/invoices/INVALID_ID`);
        // then
        expect(response.status).toEqual(500);
    });
});