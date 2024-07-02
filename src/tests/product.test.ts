import redisPubSubService from "../services/redisPubSub.service";

class ProductServiceTest {
    static purchaseProduct(productId: string, quantity: number) {
        const order = { productId, quantity };
        redisPubSubService.publish('purchase_events', JSON.stringify(order));
    }
}

export default ProductServiceTest;