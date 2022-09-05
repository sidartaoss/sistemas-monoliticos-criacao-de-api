import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface, { InputAddClientFacadeDto, InputFindClientFacadeDto, OutputAddClientFacadeDto, OutputFindClientFacadeDto } from "./client-adm.facade.interface";

export interface UseCaseProps {
    addClientUseCase: UseCaseInterface;
    findClientUseCase: UseCaseInterface;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {

    private _addClientUseCase: UseCaseInterface;
    private _findClientUseCase: UseCaseInterface;

    constructor(props: UseCaseProps) {
        this._addClientUseCase = props.addClientUseCase;
        this._findClientUseCase = props.findClientUseCase;
    }

    async add(input: InputAddClientFacadeDto): Promise<OutputAddClientFacadeDto> {
        return await this._addClientUseCase.execute(input);
    }

    async find(input: InputFindClientFacadeDto): Promise<OutputFindClientFacadeDto> {
        return await this._findClientUseCase.execute(input);    
    }
}