import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const expectedName = "Some Client";
const expectedDocument = "Some Doc";

const expectedStreet = "Rua Abc";
const expectedNumber = "012";
const expectedComplement = "Some Apt";
const expectedCity = "Caxias do Sul";
const expectedState = "Rio Grande do Sul";
const expectedZipCode = "90333000";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn()
    }
};

describe("Generate invoice unit tests", () => {

    it("should generate an invoice", async () => {
        // given
        const invoiceRepository = MockRepository();
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);

        const product1 = {
            id: "p1",
            name: "Product 1",
            price: 30
        };

        const product2 = {
            id: "p2",
            name: "Product 2",
            price: 40
        };

        const input = {
            name: expectedName,
            document: expectedDocument,
            street: expectedStreet,
            number: expectedNumber,
            complement: expectedComplement,
            city: expectedCity,
            state: expectedState,
            zipCode: expectedZipCode,
            items: [ product1, product2 ]
        };

        const expectedTotal = product1.price + product2.price;

        // when
        const output = await generateInvoiceUseCase.execute(input);

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
        expect(output.items[0].price).toBe(product1.price);

        expect(output.items[1].id).toBe(product2.id);
        expect(output.items[1].name).toBe(product2.name);
        expect(output.items[1].price).toBe(product2.price);

        expect(output.total).toBe(expectedTotal);

        expect(invoiceRepository.add).toHaveBeenCalledTimes(1);
    });
});