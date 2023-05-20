import mongoose from 'mongoose';

type PushNotification = {
    id: string,
    device_token: string,
    title: string,
    subtitle?: string,
    body?: string,
    
}
type CreatePushNotification = Omit<PushNotification, 'id'>;

const pushNotificationSchema = new mongoose.Schema({
    device_token: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    body: { type: String },
});
const PushNotificationModel = mongoose.model('PushNotification', pushNotificationSchema);

const _documentToPushNotification = (document: any): PushNotification => {
    return { 
        id: document._id.toString(),
        device_token: document.device_token,
        title: document.title,
        subtitle: document.subtitle,
        body: document.body,
    }
}

const findNotificationsByUserId = async (userId: string) => {
    const documents = await PushNotificationModel.find({ device_token: userId });
    const notifications = documents.map((document) => {
        const notificationResult = _documentToPushNotification(document);
        return notificationResult;
    });
    return notifications;
}


const saveNotification = async (notification: CreatePushNotification): Promise<PushNotification> => {
    const document =  await PushNotificationModel.create(notification);
    const notificationResult = _documentToPushNotification(document);
    return notificationResult;
}

const saveAllNotifications = async (notifications: CreatePushNotification []): Promise<PushNotification[]> => {
    const documents =  await PushNotificationModel.create(notifications);
    const notificationsResult = documents.map((document) => {
        const notificationResult = _documentToPushNotification(document);
        return notificationResult;
    });
    return notificationsResult;
}

const pushNotificationDatabase = {
    findNotificationsByUserId,
    saveNotification,
    saveAllNotifications,
}

export { pushNotificationDatabase };
