import mongoose from "mongoose";
import { CreatePushNotificationType } from '@src/controllers/schemas';

enum Status {
    Delivered = 'Delivered',
    Pending = 'Pending',
    Failed = 'Failed',
    NotSent = 'NotSent'
}

type PushNotification = {
    id: string,
    user_id: string,
    device_token: string,
    title: string,
    subtitle?: string,
    body?: string,
    sound?: CreatePushNotificationType['body']['sound'],
    status?: Status,
    expoReceiptId?: string,
    data?: any,
    read: boolean,
    created_at?: string
}

const pushNotificationSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    device_token: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    body: { type: String },
    sound: { type: String },
    status: { type: String, enum: (Object.keys(Status) as Array<keyof typeof Status>).map(key => Status[key]), default: Status.NotSent },
    expoReceiptId: { type: String },
    data: { type: Object },
    read: { type: Boolean, default: false }
}, { 
    collection: 'push_notifications', 
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
  }}
);

const Types = {
    ObjectId: (id: string) => {
        return new mongoose.Types.ObjectId(id);
    },
};
const PushNotificationModel = mongoose.model('PushNotification', pushNotificationSchema);
export { Types, PushNotification, PushNotificationModel, Status };
