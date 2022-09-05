import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn()
    }
};

describe("Add Client Use Case unit tests", () => {

    it("should add a client", async () => {

        const clientRepository = MockRepository();
        const addClientUseCase = new AddClientUseCase(clientRepository);

        const input = {
            name: "Client 1",
            email: "client@client.com",
            document: "0000",
            street: "Rua Abc",
            number: "012",
            complement: "AP",
            city: "Caxias do Sul",
            state: "Rio Grande do Sul",
            zipCode: "90333000"
        }

        const result = await addClientUseCase.execute(input);

        expect(clientRepository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.email).toEqual(input.email);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);

    });

});