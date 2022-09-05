import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const client = new Client(
    {
        id: new Id("1"),
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
);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(client)),
        add: jest.fn()
    }
}

describe("Find Client Use Case unit tests", () => {

    it("should find a client", async () => {
        const clientRepository = MockRepository();
        const findClientUseCase = new FindClientUseCase(clientRepository);

        const input = {
            id: "1"
        }

        const result = await findClientUseCase.execute(input);

        expect(clientRepository.find).toHaveBeenCalled();
        expect(result.id).toBe("1");
        expect(result.name).toBe("Client 1");
        expect(result.email).toBe("client@client.com");
        expect(client.document).toBe("0000");
        expect(client.street).toBe("Rua Abc");
        expect(client.number).toBe("012");
        expect(client.complement).toBe("AP");
        expect(client.city).toBe("Caxias do Sul");
        expect(client.state).toBe("Rio Grande do Sul");
        expect(client.zipCode).toBe("90333000");
        expect(result.createdAt).toBeDefined();
        expect(result.updatedAt).toBeDefined();
    });

});