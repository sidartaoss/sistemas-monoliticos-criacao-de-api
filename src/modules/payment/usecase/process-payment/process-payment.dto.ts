export interface InputProcessPaymentUseCaseDto {
    orderId: string;
    amount: number;
}

export interface OutputProcessPaymentUseCaseDto {
    transactionId: string;
    orderId: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}