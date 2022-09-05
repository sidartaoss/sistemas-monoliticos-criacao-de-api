import ProductAdmFacadeInterface, { InputAddProductFacadeDto, InputCheckStockFacadeDto, OutputAddProductFacadeDto, OutputCheckStockFacadeDto } from "./product-adm.facade.interface";
import AddProductUseCase from "./../usecase/add-product/add-product.usecase";
import UseCaseInterface from "../../@shared/usecase/use-case.interface";

export interface UseCaseProps {
    addProductUseCase: UseCaseInterface;
    checkStockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {

    private _addProductUseCase: UseCaseInterface;
    private _checkStockUseCase: UseCaseInterface;

    constructor(useCaseProps: UseCaseProps) {
        this._addProductUseCase = useCaseProps.addProductUseCase;
        this._checkStockUseCase = useCaseProps.checkStockUseCase;
    }

    async addProduct(input: InputAddProductFacadeDto): Promise<OutputAddProductFacadeDto> {
        return await this._addProductUseCase.execute(input);
    }

    async checkStock(input: InputCheckStockFacadeDto): Promise<OutputCheckStockFacadeDto> {
        return await this._checkStockUseCase.execute(input);
    }
}