import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceModel from "../repository/invoice.model";
import ProductModel from "../repository/product.model";

const expectedName = "Some Client";
const expectedDocument = "Some Doc";

const expectedStreet = "Rua Abc";
const expectedNumber = "012";
const expectedComplement = "Some Apt";
const expectedCity = "Caxias do Sul";
const expectedState = "Rio Grande do Sul";
const expectedZipCode = "90333000";

describe("Invoice facade tests", () => {
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

    it("should create an invoice", async () => {
        // given
/*
        const invoiceRepository = new InvoiceRepository();
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);
        const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
        const invoiceFacade = new InvoiceFacade({
            generateInvoiceUseCase: generateInvoiceUseCase,
            findInvoiceUseCase: findInvoiceUseCase
        });
*/
        const invoiceFacade = InvoiceFacadeFactory.create();

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

        const input = {
            name: expectedName,
            document: expectedDocument,
            street: expectedStreet,
            number: expectedNumber,
            complement: expectedComplement,
            city: expectedCity,
            state: expectedState,
            zipCode: expectedZipCode,
            items: [ {
                id: product1.id,
                name: product1.name,
                price: product1.salesPrice
            }, {
                id: product2.id,
                name: product2.name,
                price: product2.salesPrice
            } ]
        };

        const expectedTotal = product1.salesPrice + product2.salesPrice;

        // when
        const output = await invoiceFacade.create(input);

        // then
        expect(output).toBeDefined();
        expect(output.id).toBeDefined();

        expect(output.name).toBe(expectedName);
        expect(output.document).toBe(expectedDocument);

        expect(output.street).toBe(expectedStreet);
        expect(output.number).toBe(expectedNumber);
        expect(output.complement).toBe(expectedComplement);
        expect(output.city).toBe(expectedCity);
        expect(output.state).toBe(expectedState);
        expect(output.zipCode).toBe(expectedZipCode);

        expect(output.items).toBeDefined();
        expect(output.items.length).toBe(2);

        expect(output.items[0].id).toBe(product1.id);
        expect(output.items[0].name).toBe(product1.name);
        expect(output.items[0].price).toBe(product1.salesPrice);

        expect(output.items[1].id).toBe(product2.id);
        expect(output.items[1].name).toBe(product2.name);
        expect(output.items[1].price).toBe(product2.salesPrice);

        expect(output.total).toBe(expectedTotal);

        const invoiceDb = await InvoiceModel.findOne({
            where: { id: output.id },
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
/*
        const invoiceRepository = new InvoiceRepository();
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);
        const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
        const invoiceFacade = new InvoiceFacade({
            generateInvoiceUseCase: generateInvoiceUseCase,
            findInvoiceUseCase: findInvoiceUseCase
        });
*/
        const invoiceFacade = InvoiceFacadeFactory.create();

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

        const input = {
            name: expectedName,
            document: expectedDocument,
            street: expectedStreet,
            number: expectedNumber,
            complement: expectedComplement,
            city: expectedCity,
            state: expectedState,
            zipCode: expectedZipCode,
            items: [ {
                id: product1.id,
                name: product1.name,
                price: product1.salesPrice
            }, {
                id: product2.id,
                name: product2.name,
                price: product2.salesPrice
            } ]
        };

        const expectedTotal = product1.salesPrice + product2.salesPrice;

        const result = await invoiceFacade.create(input);

        expect(result).toBeDefined();
        expect(result.id).toBeDefined();

        const input2 = {
            id: result.id
        };

        // when
        const output = await invoiceFacade.find(input2);

        // then
        expect(output).toBeDefined();

        expect(output.name).toBe(expectedName);
        expect(output.document).toBe(expectedDocument);

        expect(output.address.street).toBe(expectedStreet);
        expect(output.address.number).toBe(expectedNumber);
        expect(output.address.complement).toBe(expectedComplement);
        expect(output.address.city).toBe(expectedCity);
        expect(output.address.state).toBe(expectedState);
        expect(output.address.zipCode).toBe(expectedZipCode);

        expect(output.items).toBeDefined();
        expect(output.items.length).toBe(2);

        expect(output.items[0].id).toBe(product1.id);
        expect(output.items[0].name).toBe(product1.name);
        expect(output.items[0].price).toBe(product1.salesPrice);

        expect(output.items[1].id).toBe(product2.id);
        expect(output.items[1].name).toBe(product2.name);
        expect(output.items[1].price).toBe(product2.salesPrice);

        expect(output.total).toBe(expectedTotal);
        expect(output.createdAt).toBeDefined();
    });

});