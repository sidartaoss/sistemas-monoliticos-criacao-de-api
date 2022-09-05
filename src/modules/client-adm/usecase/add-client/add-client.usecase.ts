import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Client from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import { InputAddClientUseCaseDto, OutputAddClientUseCaseDto } from "./add-client.usecase.dto";

export default class AddClientUseCase implements UseCaseInterface {

    private _clientRepository: ClientGateway;

    constructor(clientRepository: ClientGateway) {
        this._clientRepository = clientRepository;
    }

    async execute(input: InputAddClientUseCaseDto): Promise<OutputAddClientUseCaseDto> {
        const client = new Client({
            id: new Id(input.id) || new Id(),
            name: input.name,
            email: input.email,
            document: input.document,
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode
        });
        await this._clientRepository.add(client);
        return {
            id: client.id.id,
            name: client.name,
            email: client.email,
            document: input.document,
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt
        };
    }
}