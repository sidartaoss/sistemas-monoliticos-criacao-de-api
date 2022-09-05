import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { InputFindInvoiceFacadeDto, InputGenerateInvoiceFacadeDto, OutputFindInvoiceFacadeDto, OutputGenerateInvoiceFacadeDto } from "./invoice.facade.interface";

type InvoiceFacadeProps = {
    generateInvoiceUseCase: UseCaseInterface;
    findInvoiceUseCase: UseCaseInterface
}

export default class InvoiceFacade implements InvoiceFacadeInterface {

    private _generateInvoiceUseCase: UseCaseInterface;
    private _findInvoiceUseCase: UseCaseInterface;

    constructor(props: InvoiceFacadeProps) {
        this._generateInvoiceUseCase = props.generateInvoiceUseCase;
        this._findInvoiceUseCase = props.findInvoiceUseCase;
    }

    async create(input: InputGenerateInvoiceFacadeDto): Promise<OutputGenerateInvoiceFacadeDto> {
        return await this._generateInvoiceUseCase.execute(input);
    }

    async find(input: InputFindInvoiceFacadeDto): Promise<OutputFindInvoiceFacadeDto> {
        return await this._findInvoiceUseCase.execute(input);
    }
}