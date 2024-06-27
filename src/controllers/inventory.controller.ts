import { Request, Response, NextFunction } from 'express'
import { SuccessResponse } from '../core/success.response';
import InventoryService from '../services/inventory.service';

class InventoryController {
    /**
      * @desc add stock to inventoru
      * @param {IInventory} 
      * @return {JSON}  
      */
    addStockToInventory = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'add stock success!',
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}

export default new InventoryController()