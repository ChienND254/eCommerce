import { model, Schema } from 'mongoose';
import { INotification } from '../interfaces';

const DOCUMENT_NAME: string = 'Notification'
const COLLECTION_NAME: string = 'Notifications'

const notificationSchema: Schema = new Schema({
   noti_type: {type: String, enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"], require: true},
   noti_senderId: { type: Schema.Types.ObjectId, ref: 'Shop', require: true},
   noti_receivedId: { type: Number, require: true},
   noti_content: { type: String, require: true},
   noti_options: { type: Object, default: {}}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const notificationModel = model<INotification>(DOCUMENT_NAME, notificationSchema);

export { notificationModel };