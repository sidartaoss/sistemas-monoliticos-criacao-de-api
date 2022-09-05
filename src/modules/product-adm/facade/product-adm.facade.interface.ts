export interface InputAddProductFacadeDto {
    id?: string;
    name: string;
    description: string;
    purchasePrice: number;
    salesPrice: number;
    stock: number;
}

export interface OutputAddProductFacadeDto {
    id: string;
    name: string;
    description: string;
    purchasePrice: number;
    salesPrice: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface InputCheckStockFacadeDto {
    productId: string;
}

export interface OutputCheckStockFacadeDto {
    productId: string;
    stock: number;
}

export default interface ProductAdmFacadeInterface {
    
    addProduct(input: InputAddProductFacadeDto): Promise<OutputAddProductFacadeDto>;
    checkStock(input: InputCheckStockFacadeDto): Promise<OutputCheckStockFacadeDto>;
}