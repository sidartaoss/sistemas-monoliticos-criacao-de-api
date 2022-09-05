import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import ProductModel from "./product.model";

@Table({
    tableName: "invoices-items",
    timestamps: false
})
export default class InvoiceItemModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false })
    declare product_id: string;

    @BelongsTo(() => ProductModel)
    declare product: ProductModel;

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    declare invoice_id: string;

    @BelongsTo(() => InvoiceModel)
    declare invoice: InvoiceModel;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare price: number;

    @Column({ allowNull: false })
    declare createdAt: Date;

    @Column({ allowNull: false })
    declare updatedAt: Date;
}