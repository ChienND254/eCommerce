import redisPubSubService from "../services/redisPubSub.service";

class InventoryServiceTest {
    constructor() {
        redisPubSubService.subscribe('purchase_events', (channel: any, message: string) => {
            const { productId, quantity } = JSON.parse(message);
            
            console.log(`Received message on channel ${channel}: ${message}`);
            
            InventoryServiceTest.updateInventory({productId, quantity});
        });
    }

    static updateInventory({productId, quantity}:{productId: string, quantity:number}) {
        console.log(`[0001]: Update inventory ${productId} with quantity ${quantity}`);
    }
}
module.exports =  new InventoryServiceTest();