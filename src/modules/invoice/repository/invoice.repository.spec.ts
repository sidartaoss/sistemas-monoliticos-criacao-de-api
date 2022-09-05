import { Sequelize } from "sequelize-typescript";
import Invoice from "../domain/invoice.entity";
import Address from "../value-object/address";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import ProductModel from "./product.model";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

const expectedName = "Some Client";
const expectedDocument = "Some Doc";

const expectedStreet = "Rua Abc";
const expectedNumber = "012";
const expectedComplement = "Some Apt";
const expectedCity = "Caxias do Sul";
const expectedState = "Rio Grande do Sul";
const expectedZipCode = "90333000";

describe("Invoice repository tests", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([InvoiceModel, InvoiceItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should save an invoice", async () => {
        // given
        const address = new Address(
            expectedStreet,
            expectedNumber, 
            expectedCity, 
            expectedState, 
            expectedZipCode);

        address.changeComplement(expectedComplement);

        const product1 = await ProductModel.create({
            id: "p1",
            name: "Product 1",
            salesPrice: 40
        });

        const product2 = await ProductModel.create({
            id: "p2",
            name: "Product 2",
            salesPrice: 50
        });

        const expectedTotal = (
            product1.salesPrice + product2.salesPrice
        );

        const item1 = new Product({ 
            id: new Id(product1.id),
            name: product1.name, 
            price: product1.salesPrice
        });

        const item2 = new Product({
            id: new Id(product2.id),
            name: product2.name, 
            price: product2.salesPrice
        });

        const invoice = new Invoice({
            name: expectedName,
            document: expectedDocument,
            address: address,
            items: [ item1, item2 ]
        });

        const invoiceRepository = new InvoiceRepository();

        // when
        await invoiceRepository.add(invoice);

        // then
        const invoiceDb = await InvoiceModel.findOne({
            where: { id: invoice.id.id },
            include: [ "items" ]
        });

        expect(invoiceDb).toBeDefined();
        expect(invoiceDb.id).toBeDefined();

        expect(invoiceDb.name).toBe(expectedName);
        expect(invoiceDb.document).toBe(expectedDocument);

        expect(invoiceDb.street).toBe(expectedStreet);
        expect(invoiceDb.number).toBe(expectedNumber);
        expect(invoiceDb.complement).toBe(expectedComplement);
        expect(invoiceDb.city).toBe(expectedCity);
        expect(invoiceDb.state).toBe(expectedState);
        expect(invoiceDb.zipCode).toBe(expectedZipCode);

        expect(invoiceDb.items).toBeDefined();
        expect(invoiceDb.items.length).toBe(2);

        expect(invoiceDb.items[0].id).toBeDefined();
        expect(invoiceDb.items[0].product_id).toBe(product1.id);
        expect(invoiceDb.items[0].name).toBe(product1.name);
        expect(invoiceDb.items[0].price).toBe(product1.salesPrice);
        expect(invoiceDb.items[0].createdAt).toBeDefined();
        expect(invoiceDb.items[0].updatedAt).toBeDefined();

        expect(invoiceDb.items[1].id).toBeDefined();
        expect(invoiceDb.items[1].product_id).toBe(product2.id);
        expect(invoiceDb.items[1].name).toBe(product2.name);
        expect(invoiceDb.items[1].price).toBe(product2.salesPrice);
        expect(invoiceDb.items[1].createdAt).toBeDefined();
        expect(invoiceDb.items[1].updatedAt).toBeDefined();

        expect(invoiceDb.total).toBe(expectedTotal);

        expect(invoiceDb.createdAt).toBeDefined();
        expect(invoiceDb.updatedAt).toBeDefined();

    });

    it("should find an invoice", async () => {
        // given
        const address = new Address(
            expectedStreet,
            expectedNumber, 
            expectedCity, 
            expectedState, 
            expectedZipCode);

        address.changeComplement(expectedComplement);

        const product1 = await ProductModel.create({
            id: "p1",
            name: "Product 1",
            salesPrice: 40
        });

        const product2 = await ProductModel.create({
            id: "p2",
            name: "Product 2",
            salesPrice: 50
        });

        const item1 = new Product({ 
            id: new Id(product1.id),
            name: product1.name, 
            price: product1.salesPrice
        });

        const item2 = new Product({
            id: new Id(product2.id),
            name: product2.name, 
            price: product2.salesPrice
        });

        const expectedInvoice = new Invoice({
            name: expectedName,
            document: expectedDocument,
            address: address,
            items: [ item1, item2 ]
        });

        const invoiceRepository = new InvoiceRepository();

        await invoiceRepository.add(expectedInvoice);

        const id = expectedInvoice.id.id;

        // when
        const actualInvoice = await invoiceRepository.find(id);

        // then
        expect(actualInvoice).toBeDefined();
        expect(actualInvoice.id).toBeDefined();

        expect(actualInvoice.name).toBe(expectedName);
        expect(actualInvoice.document).toBe(expectedDocument);

        expect(actualInvoice.address.street).toBe(expectedStreet);
        expect(actualInvoice.address.number).toBe(expectedNumber);
        expect(actualInvoice.address.complement).toBe(expectedComplement);
        expect(actualInvoice.address.city).toBe(expectedCity);
        expect(actualInvoice.address.state).toBe(expectedState);
        expect(actualInvoice.address.zipCode).toBe(expectedZipCode);

        expect(actualInvoice.items).toBeDefined();
        expect(actualInvoice.items.length).toBe(2);

        expect(actualInvoice.items[0].id.id).toBe(product1.id);
        expect(actualInvoice.items[0].name).toBe(product1.name);
        expect(actualInvoice.items[0].price).toBe(product1.salesPrice);
        expect(actualInvoice.items[0].createdAt).toBeDefined();
        expect(actualInvoice.items[0].updatedAt).toBeDefined();

        expect(actualInvoice.items[1].id.id).toBe(product2.id);
        expect(actualInvoice.items[1].name).toBe(product2.name);
        expect(actualInvoice.items[1].price).toBe(product2.salesPrice);
        expect(actualInvoice.items[1].createdAt).toBeDefined();
        expect(actualInvoice.items[1].updatedAt).toBeDefined();

        expect(actualInvoice.total).toBe(expectedInvoice.total);

        expect(actualInvoice.createdAt).toBeDefined();
        expect(actualInvoice.updatedAt).toBeDefined();


    });
});