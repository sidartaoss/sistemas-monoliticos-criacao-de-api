import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import ClientModel from "./client.model";
import ClientRepository from "./client.repository";

describe("Client Repository tests", () => {

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
        const clientProps = {
            id: new Id("1"),
            name: "Client 1",
            email: "client@client.com",
            document: "0000",
            street: "Rua Abc",
            number: "012",
            complement: "AP",
            city: "Caxias do Sul",
            state: "Rio Grande do Sul",
            zipCode: "90333000",
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const client = new Client(clientProps);
        const clientRepository = new ClientRepository();
        await clientRepository.add(client);

        const clientDb = await ClientModel.findOne(
            { where: { id: clientProps.id.id } }
        );

        expect(clientDb).toBeDefined();

        expect(clientDb.id).toEqual(clientProps.id.id);
        expect(clientDb.name).toEqual(clientProps.name);
        expect(clientDb.email).toEqual(clientProps.email);
        expect(clientDb.document).toBe(clientProps.document);

        expect(clientDb.street).toBe(clientProps.street);
        expect(clientDb.number).toBe(clientProps.number);
        expect(clientDb.complement).toBe(clientProps.complement);
        expect(clientDb.city).toBe(clientProps.city);
        expect(clientDb.state).toBe(clientProps.state);
        expect(clientDb.zipCode).toBe(clientProps.zipCode);

        expect(clientDb.createdAt).toBeDefined();
        expect(clientDb.updatedAt).toBeDefined();
    })

    it("should find a client", async () => {
        const clientRepository = new ClientRepository();
        await ClientModel.create({
            id: "1",
            name: "Client 1",
            email: "client@client.com",
            document: "0000",
            street: "Rua Abc",
            number: "012",
            complement: "AP",
            city: "Caxias do Sul",
            state: "Rio Grande do Sul",
            zipCode: "90333000",
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const client = await clientRepository.find("1");

        expect(client.id.id).toEqual("1");
        expect(client.name).toEqual("Client 1");
        expect(client.email).toEqual("client@client.com");
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

});