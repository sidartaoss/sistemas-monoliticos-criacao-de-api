import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../value-object/address";
import Invoice from "./invoice.entity";
import Product from "./product.entity";

describe("Invoice unit tests", () => {

    const expectedId = new Id("1i");
    const expectedName = "Some Client";
    const expectedDocument = "0000";

    const expectedStreet = "Rua Abc";
    const expectedNumber = "123";
    const expectedComplement = "33";
    const expectedCity = "Caxias do Sul";
    const expectedState = "Rio Grande do Sul";
    const expectedZipCode = "93000333";

    const expectedAddress = new Address(
        expectedStreet,
        expectedNumber,
        expectedCity,
        expectedState,
        expectedZipCode
    );

    const expectedProduct = new Product({
        id: new Id("p1"),
        name: "Product 1",
        price: 30
    });

    it("should throw an error when name is empty", () => {
        expect(() => {
            const invoice = new Invoice({
                id: expectedId,
                name: "",
                document: expectedDocument,
                address: expectedAddress,
                items: [ expectedProduct ]
            });
        }).toThrowError("Name is required");
    });

    it("should throw an error when document is empty", () => {
        expect(() => {
            const invoice = new Invoice({
                id: expectedId,
                name: expectedName,
                document: "",
                address: expectedAddress,
                items: [ expectedProduct ]
            });
        }).toThrowError("Document is required");
    });

    it("should throw an error when address is null", () => {
        expect(() => {
            const invoice = new Invoice({
                id: expectedId,
                name: expectedName,
                document: expectedDocument,
                address: null,
                items: [ expectedProduct ]
            });
        }).toThrowError("Address is required")
    });

    it("should throw an error when items is empty", () => {
        expect(() => {
            const invoice = new Invoice({
                id: expectedId,
                name: expectedName,
                document: expectedDocument,
                address: expectedAddress,
                items: []
            });
        }).toThrowError("Items are required");
    });

    it("should create a new invoice", () => {
        // given
        expectedAddress.changeComplement(
            expectedComplement
        );

        // when
        const actualInvoice = new Invoice({
            name: expectedName,
            document: expectedDocument,
            address: expectedAddress,
            items: [ expectedProduct ]
        });

        // then
        expect(actualInvoice).toBeDefined();
        expect(actualInvoice.id).toBeDefined();

        expect(actualInvoice.name).toBe(expectedName);
        expect(actualInvoice.document).toBe(expectedDocument);

        expect(actualInvoice.address).toBeDefined();
        expect(actualInvoice.address.street).toBe(expectedStreet);
        expect(actualInvoice.address.number).toBe(expectedNumber);
        expect(actualInvoice.address.complement).toBe(expectedComplement);
        expect(actualInvoice.address.city).toBe(expectedCity);
        expect(actualInvoice.address.state).toBe(expectedState);
        expect(actualInvoice.address.zipCode).toBe(expectedZipCode);

        expect(actualInvoice.items).toBeDefined();
        expect(actualInvoice.items[0].id).toBe(expectedProduct.id);
        expect(actualInvoice.items[0].name).toBe(expectedProduct.name);
        expect(actualInvoice.items[0].price).toBe(expectedProduct.price);

        expect(actualInvoice.createdAt).toBeDefined();
        expect(actualInvoice.updatedAt).toBeDefined();
    });

});