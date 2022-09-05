import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Product from "../../domain/product.entity";
import ProductGateway from "../../gateway/product.gateway";
import { InputAddProductDto, OutputAddProductDto } from "./add-product.dto";

export default class AddProductUseCase implements UseCaseInterface {

    private _productRepository: ProductGateway;

    constructor(productRepository: ProductGateway) {
        this._productRepository = productRepository;
    }

    async execute(input: InputAddProductDto): Promise<OutputAddProductDto> {

        const product = new Product({
            id: new Id(input.id),
            name: input.name,
            description: input.description,
            purchasePrice: input.purchasePrice,
            salesPrice: input.salesPrice,
            stock: input.stock  
        });

        await this._productRepository.add(product);

        return {
            id: product.id.id,
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            salesPrice: product.salesPrice,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };

    }
}