import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object"

type ClientProps = {
    id?: Id;
    name: string;
    email: string;
    document: string;
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zipCode: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default class Client extends BaseEntity implements AggregateRoot {

    private _name: string;
    private _email: string;
    private _document: string;
    private _street: string;
    private _number: string;
    private _complement: string;
    private _city: string;
    private _state: string;
    private _zipCode: string;

    constructor(props: ClientProps) {
        super(props.id, props.createdAt, props.updatedAt);
        this._name = props.name;
        this._email = props.email;
        this._document = props.document;
        this._street = props.street;
        this._number = props.number;
        this._complement = props.complement;
        this._city = props.city;
        this._state = props.state;
        this._zipCode = props.zipCode;
        this.validate();
    }

    validate() {
        if (this._name.length == 0) {
            throw new Error("Name is required");
        }
        if (this._email.length == 0) {
            throw new Error("Email is required");
        }
        if (this._document.length == 0) {
            throw new Error("Document is required");
        }
        if (this._street.length == 0) {
            throw new Error("Street is required");
        }
        if (this._number.length == 0) {
            throw new Error("Number is required");
        }
        if (this._city.length == 0) {
            throw new Error("City is required");
        }
        if (this._state.length == 0) {
            throw new Error("State is required");
        }
        if (this._zipCode.length == 0) {
            throw new Error("Zip Code is required");
        }
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get document(): string {
        return this._document;
    }

    get street(): string {
        return this._street;
    }

    get number(): string {
        return this._number;
    }

    get complement(): string {
        return this._complement;
    }

    get city(): string {
        return this._city;
    }

    get state(): string {
        return this._state;
    }

    get zipCode(): string {
        return this._zipCode;
    }

}