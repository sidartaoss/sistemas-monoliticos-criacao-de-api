import express, {Request, Response} from "express";
import InvoiceFacadeFactory from "../../../invoice/factory/invoice.facade.factory";

export const invoiceRouter = express.Router({mergeParams: true});

invoiceRouter.get("/", async (req: Request, res: Response) => {
    const invoiceFacadeInterface = InvoiceFacadeFactory.create();
    try {
        const input = {
            id: req.params.id
        }
        const output = await invoiceFacadeInterface.find(input);
        res.send(output);
    } catch (error) {
        res.status(500).send(error);
    }
});