import { app, sequelize } from "../express";
import request from "supertest";

const expectedName = "Some Client";
const expectedEmail = "client@client.com";
const expectedDocument = "Some Doc";
const expectedStreet = "Rua Abc";
const expectedNumber = "012";
const expectedComplement = "AP";
const expectedCity = "Caxias do Sul";
const expectedState = "Rio Grande do Sul";
const expectedZipCode = "90333000";

describe("E2E test for client", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });
    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a client", async () => {
        // given when
        const response = await request(app)
                .post("/clients")
                .send({
                    name: expectedName,
                    email: expectedEmail,
                    document: expectedDocument,
                    street: expectedStreet,
                    number: expectedNumber,
                    complement: expectedComplement,
                    city: expectedCity,
                    state: expectedState,
                    zipCode: expectedZipCode
                });
        // then
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe(expectedName);
        expect(response.body.email).toBe(expectedEmail);
        expect(response.body.document).toBe(expectedDocument);
        expect(response.body.street).toBe(expectedStreet);
        expect(response.body.number).toBe(expectedNumber);
        expect(response.body.complement).toBe(expectedComplement);
        expect(response.body.city).toBe(expectedCity);
        expect(response.body.state).toBe(expectedState);
        expect(response.body.zipCode).toBe(expectedZipCode);
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
    });

    it("should not create a client", async () => {
        // given when
        const response = await request(app)
                .post("/clients")
                .send({
                    name: expectedName,
                    email: expectedEmail,
                    document: expectedDocument
                });
        // then
        expect(response.status).toBe(500);
    });
});