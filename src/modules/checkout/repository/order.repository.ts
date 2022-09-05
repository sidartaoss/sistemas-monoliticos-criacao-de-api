import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements CheckoutGateway {

    async addOrder(order: Order): Promise<void> {
        await OrderModel.create({
            id: order.id.id,
            client_id: order.client.id.id,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: order.products.map(product => ({
                id: new Id().id,
                product_id: product.id.id,
                name: product.name,
                price: product.salesPrice,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
        },
            {
                include: [
                    {
                        model: OrderItemModel
                    }
                ]
            }
        );
    }

    async findOrder(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({
            where: { id },
            include: [ "client", "items" ]
        });
        return new Order({
            id: new Id(orderModel.id),
            client: new Client({
                id: new Id(orderModel.client.id),
                name: orderModel.client.name,
                email: orderModel.client.email,
                address: orderModel.client.address
            }),
            products: orderModel.items.map(item => (
                new Product({
                    id: new Id(item.product_id),
                    name: item.name,
                    description: null,
                    salesPrice: item.price
                })
            )),
            status: orderModel.status
        });
    }
}
