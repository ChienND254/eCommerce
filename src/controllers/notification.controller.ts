import { Request, Response, NextFunction } from 'express'
import NotificationService from '../services/notification.service';
import { SuccessResponse } from '../core/success.response';

class NotificationController {

    /**
     * @desc get Notification
     * @return {JSON} 
     */
    listNotiByUser = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'get list noti by user',
            metadata: await NotificationService.listNotiByUser(req.query)
        }).send(res)
    }
}

export default new NotificationController()