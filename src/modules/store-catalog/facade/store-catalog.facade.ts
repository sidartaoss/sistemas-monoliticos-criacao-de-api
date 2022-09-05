import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import StoreCatalogFacadeInterface, { InputFindAllStoreCatalogFacadeDto, InputFindStoreCatalogFacadeDto, OutputFindAllStoreCatalogFacadeDto, OutputFindStoreCatalogFacadeDto } from "./store-catalog.facade.interface";

export interface UseCaseProps {
    findProductUseCase: FindProductUseCase,
    findAllProductsUseCase: FindAllProductsUseCase
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {

    private _findProductUseCase: FindProductUseCase;
    private _findAllProductsUseCase: FindAllProductsUseCase;

    constructor(props: UseCaseProps) {
        this._findProductUseCase = props.findProductUseCase;
        this._findAllProductsUseCase = props.findAllProductsUseCase;
    }

    async find(input: InputFindStoreCatalogFacadeDto): Promise<OutputFindStoreCatalogFacadeDto> {
        return await this._findProductUseCase.execute(input);
    }

    async findAll(input: InputFindAllStoreCatalogFacadeDto): Promise<OutputFindAllStoreCatalogFacadeDto> {
        return await this._findAllProductsUseCase.execute(input);
    }
}