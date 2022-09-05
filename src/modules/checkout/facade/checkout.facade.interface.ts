export interface InputCheckoutFacadeDto {
    clientId: string;
    products: {
        productId: string;
    }[];
}

export interface OutputCheckoutFacadeDto {
    id: string;
    invoiceId: string;
    status: string;
    total: number;
    products: {
        productId: string;
    }[];
}

export default interface CheckoutFacadeInterface {
    placeOrder(input: InputCheckoutFacadeDto): Promise<OutputCheckoutFacadeDto>;
}
