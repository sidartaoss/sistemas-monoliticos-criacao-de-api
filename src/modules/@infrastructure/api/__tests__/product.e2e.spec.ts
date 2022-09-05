import {app, sequelize} from "../express";
import request from "supertest";

const expectedName = "Product 1";
const expectedDescription = "Some Product 1";
const expectedPurchasePrice = 30;
const expectedSalesPrice = 50;
const expectedStock = 3;

describe("E2E test for product", () => {
    
    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async() => {
        // given when
        const response = await request(app)
                .post("/products")
                .send({
                    name: expectedName,
                    description: expectedDescription,
                    purchasePrice: expectedPurchasePrice,
                    salesPrice: expectedSalesPrice,
                    stock: expectedStock
        });

        // then
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe(expectedName);
        expect(response.body.description).toBe(expectedDescription);
        expect(response.body.purchasePrice).toBe(expectedPurchasePrice);
        expect(response.body.salesPrice).toBe(expectedSalesPrice);
        expect(response.body.stock).toBe(expectedStock);
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
    });

    it("should not create a product", async () => {
        // given when
        const response = await request(app)
                .post("/products")
                .send({
                    name: expectedName,
                    description: expectedDescription,
                });
        
        // then
        expect(response.status).toBe(500);
    });

});