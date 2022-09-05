import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import Address from "../../value-object/address";
import { InputGenerateInvoiceUseCaseDto, OutputGenerateInvoiceUseCaseDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {

    private _invoiceRepository: InvoiceGateway;

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository;
    }

    async execute(input: InputGenerateInvoiceUseCaseDto): Promise<OutputGenerateInvoiceUseCaseDto> {
        const address = new Address(input.street, input.number, input.city, input.state, input.zipCode);
        address.changeComplement(input.complement);
        const invoice = new Invoice({
            name: input.name,
            document: input.document,
            address: address,
            items: input.items.map(product => 
                new Product({
                    id: new Id(product.id),
                    name: product.name,
                    price: product.price
                })
            )
        });

        await this._invoiceRepository.add(invoice);
        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map(item => (
                {
                    id: item.id.id,
                    name: item.name,
                    price: item.price
                })
            ),
            total: invoice.total
        };
    }
}