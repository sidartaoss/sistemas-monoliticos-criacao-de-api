import express, { Express } from 'express';
import { Sequelize } from 'sequelize-typescript';
import OrderItemModel from '../../checkout/repository/order-item.model';
import OrderModel from '../../checkout/repository/order.model';
import ClientModel from '../../client-adm/repository/client.model';
import InvoiceItemModel from '../../invoice/repository/invoice-item.model';
import InvoiceModel from '../../invoice/repository/invoice.model';
import TransactionModel from '../../payment/repository/transaction.model';
import ProductModel from '../../product-adm/repository/product.model';
import StoreProductModel from "../../store-catalog/repository/product.model";
import { checkoutRoute } from './routes/checkout.route';
import { clientRoute } from './routes/client.route';
import { invoiceRouter } from './routes/invoice.route';
import { productRoute } from './routes/product.route';

export const app: Express = express();
app.use(express.json());

app.use("/clients", clientRoute);
app.use("/products", productRoute);
app.use("/checkouts", checkoutRoute)
app.use("/invoices/:id", invoiceRouter);

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false
    });
    sequelize.addModels([ClientModel, ProductModel, StoreProductModel, OrderModel, OrderItemModel, TransactionModel, InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
}

setupDb();