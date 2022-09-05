import Invoice from "../../domain/invoice.entity";
import Address from "../../value-object/address";
import FindInvoiceUseCase from "./find-invoice.usecase";
import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";

const item1 = new Product({
    id: new Id("p1"),
    name: "Product 1",
    price: 30
});

const item2 = new Product({
    id: new Id("p2"),
    name: "Product 2",
    price: 40
});

const address = new Address(
    "Rua Abc", "012", "Caxias do Sul", "Rio Grande do Sul", "90333000"
);

const expectedInvoice = new Invoice({
    name: "Some Client",
    document: "Some Doc",
    address: address,
    items: [ item1, item2 ]
});

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(expectedInvoice))
    }
};

describe("Find invoice unit tests", () => {

    it("should find an invoice", async () => {
        // given
        const invoiceRepository = MockRepository();
        const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);

        const input = {
            id: expectedInvoice.id.id
        };

        // when
        const output = await findInvoiceUseCase.execute(input);

        // then
        expect(output).toBeDefined();

        expect(output.name).toBe(expectedInvoice.name);
        expect(output.document).toBe(expectedInvoice.document);

        expect(output.address.street).toBe(expectedInvoice.address.street);
        expect(output.address.number).toBe(expectedInvoice.address.number);
        expect(output.address.complement).toBe(expectedInvoice.address.complement);
        expect(output.address.city).toBe(expectedInvoice.address.city);
        expect(output.address.state).toBe(expectedInvoice.address.state);
        expect(output.address.zipCode).toBe(expectedInvoice.address.zipCode);

        expect(output.items).toBeDefined();
        expect(output.items.length).toBe(2);

        expect(output.items[0].id).toBe(expectedInvoice.items[0].id.id);
        expect(output.items[0].name).toBe(expectedInvoice.items[0].name);
        expect(output.items[0].price).toBe(expectedInvoice.items[0].price);

        expect(output.items[1].id).toBe(expectedInvoice.items[1].id.id);
        expect(output.items[1].name).toBe(expectedInvoice.items[1].name);
        expect(output.items[1].price).toBe(expectedInvoice.items[1].price);

        expect(output.total).toBe(expectedInvoice.total);
        expect(output.createdAt).toBeDefined();

        expect(invoiceRepository.find).toHaveBeenCalledTimes(1);
    });

});