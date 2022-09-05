import express, {Request, Response} from "express";
import CheckoutFacadeFactory from "../../../checkout/factory/checkout.facade.factory";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
    const checkoutFacade = CheckoutFacadeFactory.create();
    try {
        const input = {
            clientId: req.body.clientId,
            products: req.body.products
        };
        const output = await checkoutFacade.placeOrder(input);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});