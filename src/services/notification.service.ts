import { ObjectId } from "mongoose";
import { INotification } from "../interfaces";
import { notificationModel } from "../models/notification.model";
import { NotificationType, NotificationTypes } from "../utils/notificationTypes";

interface PushNotiToSystemParams {
    type?: NotificationType;
    receivedId: number;
    senderId: ObjectId;
    options?: Record<string, any>;
}

interface ListNotiByUserParams {
    userId?: number;
    type?: NotificationType | 'ALL';
    isRead?: number;
}

class NotificationService {
    static pushNotiToSystem({
        type = NotificationTypes.SHOP_001,
        receivedId,
        senderId,
        options = {}
    }: PushNotiToSystemParams): Promise<INotification> {
        let noti_content: string = ''

        if (type === 'SHOP-001') {
            noti_content = `Shop add new product: `
        } else if (type = 'PROMOTION-001') {
            noti_content = `Shop add new promotion: `
        }

        const newNotification = notificationModel.create({
            noti_type: type,
            noti_content: noti_content,
            noti_senderId: senderId,
            noti_receivedId: receivedId,
            noti_options: options
        })

        return newNotification
    }

    static async listNotiByUser({ userId = 1, type = 'ALL', isRead = 0 }: ListNotiByUserParams): Promise<any[]> {
        const match: Record<string, any> = { noti_receivedId: userId };

        if (type !== 'ALL') {
            match['noti_type'] = type
        }

        return await notificationModel.aggregate([
            {
                $match: match
            },
            {
                $project: {
                    noti_type: 1,
                    noti_senderId: 1,
                    noti_receivedId: 1,
                    noti_content: 1,
                    createAt: 1,
                    noti_options: 1
                }
            }
        ])
    }
}

export default NotificationService