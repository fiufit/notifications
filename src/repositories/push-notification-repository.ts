import { logger } from '@src/config';
import { CreatePushNotificationType } from '@src/controllers/schemas';
import mongoose from 'mongoose';
import { MongoBulkWriteError, BulkWriteResult } from 'mongodb';

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
}
type CreatePushNotification = Omit<PushNotification, 'id' | 'status'>;
type UpdatePushNotification =  Pick<PushNotification, 'id'> & Partial<Omit<PushNotification, 'id'>>;

const pushNotificationSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    device_token: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    body: { type: String },
    sound: { type: String },
    status: { type: String, enum: (Object.keys(Status) as Array<keyof typeof Status>).map(key => Status[key]), default: Status.NotSent },
    expoReceiptId: { type: String },

}, { collection: 'push_notifications' });
const PushNotificationModel = mongoose.model('PushNotification', pushNotificationSchema);

const findNotificationsByUserId = async (userId: string) => {
    try {
        const documents = await PushNotificationModel.find({ device_token: userId });
        const notifications = documents.map((document) => {
            const notificationResult = _documentToPushNotification(document);
            return notificationResult;
        });
        return notifications;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const findNotificationsByStatus = async (status: Status) => {
    try {
        const documents = await PushNotificationModel.find({ status });
        const notifications = documents.map((document) => {
            const notificationResult = _documentToPushNotification(document);
            return notificationResult;
        });
        return notifications;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const updateAllNotifications = async (notifications: UpdatePushNotification[]) => {
    try {
        const updateOperations = _buildUpdateOperations(notifications);
        const results: BulkWriteResult = await PushNotificationModel.bulkWrite(updateOperations);
        return results;
    } catch (error) {
        if (error instanceof MongoBulkWriteError) {
            logger.error('MongoBulkWriteError');
        }
        logger.error(error);
        throw error;
    }
}

const saveAllNotifications = async (notifications: CreatePushNotification []) => {
    try {
        const documents = await PushNotificationModel.create(notifications);
        const notificationsResult = documents.map((document) => {
            const notificationResult = _documentToPushNotification(document);
            return notificationResult;
        });
        return notificationsResult;
    } catch(error) {
        logger.error(error);
        throw error;
    }
}

const _buildUpdateOperations = (notifications: UpdatePushNotification[]) => {
    const updateOperations = [];
    for (const notification of notifications) {
        const filter = { _id: new mongoose.Types.ObjectId(notification.id) };
        const update = notification;
        const options = { orderder: false, forceServerObjectId: true, ordered: false };
        const singleUpdateOperation = { 
            updateOne : { filter, update, options },
        }
        updateOperations.push(singleUpdateOperation);
    };
    return updateOperations;
}

const _documentToPushNotification = (document: any): PushNotification => {
    return { 
        id: document._id.toString(),
        user_id: document.user_id,
        device_token: document.device_token,
        title: document.title,
        subtitle: document.subtitle,
        body: document.body,
        sound: document.sound,
        expoReceiptId: document.expoReceiptId,
    }
}

const pushNotificationRepository = {
    findNotificationsByUserId,
    saveAllNotifications,
    updateAllNotifications,
    findNotificationsByStatus,
}

export { pushNotificationRepository, PushNotification, UpdatePushNotification, Status };
