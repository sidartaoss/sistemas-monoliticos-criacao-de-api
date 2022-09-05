import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
    id?: Id;
    name: string;
    description: string;
    purchasePrice: number;
    salesPrice: number;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export default class Product extends BaseEntity implements AggregateRoot {

    private _name: string;
    private _description: string;
    private _purchasePrice: number;
    private _salesPrice: number;
    private _stock: number;

    constructor(props: ProductProps) {
        super(props.id);
        this._name = props.name;
        this._description = props.description;
        this._purchasePrice = props.purchasePrice;
        this._salesPrice = props.salesPrice;
        this._stock = props.stock;
        this.validate();
    }

    validate() {
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
        if (this._description.length === 0) {
            throw new Error("Description is required");
        }
        if (!this._purchasePrice) {
            throw new Error("Purchase Price is required");
        }
        if (!this._salesPrice) {
            throw new Error("Sales Price is required");
        }
        if (!this._stock) {
            throw new Error("Stock is required");
        }
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get purchasePrice(): number {
        return this._purchasePrice;
    }

    get salesPrice(): number {
        return this._salesPrice;
    }

    get stock(): number {
        return this._stock;
    }

    set stock(stock: number) {
        this._stock = stock;
    }

    set name(name: string) {
        this._name = name;
    }

    set description(description: string) {
        this._description = description;
    }

    set purchasePrice(purchasePrice: number) {
        this._purchasePrice = purchasePrice;
    }

    set salesPrice(salesPrice: number) {
        this._salesPrice = salesPrice;
    }
}