import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import Address from "../value-object/address";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import Product from "../domain/product.entity";

export default class InvoiceRepository implements InvoiceGateway {

    async add(invoice: Invoice): Promise<void> {
        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map(item => ({
                id: new Id().id,
                product_id: item.id.id,
                name: item.name,
                price: item.price,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            })),
            total: invoice.total,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        },
        {
            include: [
                {
                    model: InvoiceItemModel
                }
            ]
        });
    }

    async find(id: String): Promise<Invoice> {
        const invoiceModel = await InvoiceModel.findOne({
            where: { id },
            include: [ "items" ]
        });
        const address = new Address(
            invoiceModel.street,
            invoiceModel.number,
            invoiceModel.city,
            invoiceModel.state,
            invoiceModel.zipCode
        );
        address.changeComplement(invoiceModel.complement);
        return new Invoice({
            id: new Id(invoiceModel.id),
            name: invoiceModel.name,
            document: invoiceModel.document,
            address: address,
            items: invoiceModel.items.map(item => (new Product({
                id: new Id(item.product_id),
                name: item.name,
                price: item.price
            }))),
            createdAt: invoiceModel.createdAt,
            updatedAt: invoiceModel.updatedAt
        });
    }
}