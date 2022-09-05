import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import CheckoutFacadeInterface, { InputCheckoutFacadeDto, OutputCheckoutFacadeDto } from "./checkout.facade.interface";

type CheckoutProps = {
    placeOrderUseCase: UseCaseInterface
}
export default class CheckoutFacade implements CheckoutFacadeInterface {

    private _placeOrderUseCase: UseCaseInterface;

    constructor(props: CheckoutProps) {
        this._placeOrderUseCase = props.placeOrderUseCase;
    }

    async placeOrder(input: InputCheckoutFacadeDto): Promise<OutputCheckoutFacadeDto> {
        return await this._placeOrderUseCase.execute(input);
    }
}