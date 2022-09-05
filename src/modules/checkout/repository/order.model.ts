import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import ClientModel from "./client.model";
import OrderItemModel from "./order-item.model";

@Table({
    tableName: "orders",
    timestamps: false
})
export default class OrderModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @ForeignKey(() => ClientModel)
    @Column({ allowNull: false })
    declare client_id: string;

    @BelongsTo(() => ClientModel)
    declare client: ClientModel;

    @HasMany(() => OrderItemModel)
    declare items: OrderItemModel[];

    @Column({ allowNull: false })
    declare status: string;

    @Column({ allowNull: false })
    declare createdAt: Date;

    @Column({ allowNull: false })
    declare updatedAt: Date;
}