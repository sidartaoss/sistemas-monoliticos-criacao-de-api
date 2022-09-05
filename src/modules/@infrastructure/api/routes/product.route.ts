import express, {Request, Response} from "express";
import ProductAdmFacadeFactory from "../../../product-adm/factory/facade.factory";

export const productRoute = express.Router();

productRoute.post('/', async (req: Request, res: Response) => {
    const productAdmFacade = ProductAdmFacadeFactory.create();
    try {
        const input = {
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            salesPrice: req.body.salesPrice,
            stock: req.body.stock
        };
        const output = await productAdmFacade.addProduct(input);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});