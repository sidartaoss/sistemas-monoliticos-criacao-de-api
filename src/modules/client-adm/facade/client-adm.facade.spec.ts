import { Sequelize } from "sequelize-typescript";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";
import ClientModel from "../repository/client.model";

describe("Client Adm Facade tests", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([ClientModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should add a client", async () => {

        // const clientRepository = new ClientRepository();
        // const addClientUseCase = new AddClientUseCase(clientRepository);
        // const findClientUseCase = new FindClientUseCase(clientRepository);

        // const clientAdmFacade = new ClientAdmFacade({
        //     addClientUseCase: addClientUseCase,
        //     findClientUseCase: findClientUseCase
        // });

        const clientAdmFacade = ClientAdmFacadeFactory.create();
        
        const input = {
            id: "1",
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

        const output = await clientAdmFacade.add(input);

        expect(output).toBeDefined();
        expect(output.id).toBe("1");
        expect(output.name).toBe("Client 1");
        expect(output.email).toBe("client@client.com");
        expect(output.document).toBe("0000");
        expect(output.street).toBe("Rua Abc");
        expect(output.number).toBe("012");
        expect(output.complement).toBe("AP");
        expect(output.city).toBe("Caxias do Sul");
        expect(output.state).toBe("Rio Grande do Sul");
        expect(output.zipCode).toBe("90333000");
        expect(output.createdAt).toBeDefined();
        expect(output.updatedAt).toBeDefined();

        const client = await ClientModel.findOne({
            where: { id: "1" }
        });

        expect(client).toBeDefined();
        expect(client.name).toBe("Client 1");
        expect(client.email).toBe("client@client.com");
        expect(client.document).toBe("0000");
        expect(client.street).toBe("Rua Abc");
        expect(client.number).toBe("012");
        expect(client.complement).toBe("AP");
        expect(client.city).toBe("Caxias do Sul");
        expect(client.state).toBe("Rio Grande do Sul");
        expect(client.zipCode).toBe("90333000");
        expect(client.createdAt).toBeDefined();
        expect(client.updatedAt).toBeDefined();

    });

    it("should find a client", async () => {

        const clientAdmFacade = ClientAdmFacadeFactory.create();

        const input = {
            id: "1",
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

        await clientAdmFacade.add(input);

        const result = await clientAdmFacade.find({ id: "1" });

        expect(result).toBeDefined();
        expect(result.name).toBe("Client 1");
        expect(result.email).toBe("client@client.com");
        expect(result.document).toBe("0000");
        expect(result.street).toBe("Rua Abc");
        expect(result.number).toBe("012");
        expect(result.complement).toBe("AP");
        expect(result.city).toBe("Caxias do Sul");
        expect(result.state).toBe("Rio Grande do Sul");
        expect(result.zipCode).toBe("90333000");
        expect(result.createdAt).toBeDefined();
        expect(result.updatedAt).toBeDefined();
    });
});