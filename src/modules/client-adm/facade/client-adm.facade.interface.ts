export interface InputAddClientFacadeDto {
    id?: string;
    name: string;
    email: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface OutputAddClientFacadeDto {
    id: string;
    name: string;
    email: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface InputFindClientFacadeDto {
    id: string;
}

export interface OutputFindClientFacadeDto {
    id: string;
    name: string;
    email: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    createdAt: Date;
    updatedAt: Date;
}

export default interface ClientAdmFacadeInterface {

    add(input: InputAddClientFacadeDto): Promise<OutputAddClientFacadeDto>;
    find(input: InputFindClientFacadeDto): Promise<OutputFindClientFacadeDto>;
}