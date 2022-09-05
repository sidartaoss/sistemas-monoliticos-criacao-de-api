export interface InputFindStoreCatalogFacadeDto {
    id: string;
}

export interface OutputFindStoreCatalogFacadeDto {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
}

export interface InputFindAllStoreCatalogFacadeDto {}

export interface OutputFindAllStoreCatalogFacadeDto {
    products: {
        id: string;
        name: string;
        description: string;
        salesPrice: number;
    }[];
}

export default interface StoreCatalogFacadeInterface {

    find(input: InputFindStoreCatalogFacadeDto): Promise<OutputFindStoreCatalogFacadeDto>;
    findAll(input: InputFindAllStoreCatalogFacadeDto): Promise<OutputFindAllStoreCatalogFacadeDto>;
}