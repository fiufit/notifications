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
    data?: any,
    read: boolean,
    created_at?: string
}
type GetPushNotification = Partial<Pick<PushNotification, "user_id" | 'created_at' | 'read'>>;
type CreatePushNotification = Omit<PushNotification, 'id' | 'status' | 'read'>;
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
    data: { type: Object },
    read: { type: Boolean, default: false }
}, { 
    collection: 'push_notifications', 
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
  }}
);
const PushNotificationModel = mongoose.model('PushNotification', pushNotificationSchema);

const findNotifications = async (query: GetPushNotification, options: { limit?: number }) => {
    const { limit = 20 } = options;
    const queryParams: any = structuredClone(query);
    if (query.created_at) queryParams.created_at = { $lte: queryParams.created_at };

    try {
        const documents = await PushNotificationModel.find(queryParams).sort( { "created_at": -1 } ).limit(limit + 1);
        const pagination = { count: documents.length, limit }
        if (documents.length === 0) return { notifications: [], pagination }

        const nextCursor = Buffer.from((documents[documents.length - 1] as any).created_at.toISOString()).toString('base64');
        if (documents.length > limit) documents.length = limit;
        const notifications = documents.map((document) => {
            const notificationResult = _documentToPushNotification(document);
            return notificationResult;
        });
        return {
            notifications,
            pagination: { ... pagination, count: documents.length, next_cursor: nextCursor }
        };
    } catch (error) {
        logger.error(error);
        throw error;
    }   
}

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

const updateNotification = async (notification: UpdatePushNotification) => {
    try {
        console.log(notification);
        const filter = { _id: new mongoose.Types.ObjectId(notification.id) };
        const options = { returnOriginal: false };
        const document = await PushNotificationModel.findOneAndUpdate(filter, notification, options);
        const updateResult = _documentToPushNotification(document);
        return updateResult;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const _buildUpdateOperations = (notifications: UpdatePushNotification[]) => {
    const updateOperations = [];
    for (const notification of notifications) {
        const filter = { _id: new mongoose.Types.ObjectId(notification.id) };
        const update = notification;
        const options = { forceServerObjectId: true, ordered: false }; // ESTO NO ESTA BIEN. No existe en mongo para updateOne
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
        data: document.data,
        read: document.read,
    }
}

const pushNotificationRepository = {
    findNotifications,
    findNotificationsByUserId,
    saveAllNotifications,
    updateAllNotifications,
    findNotificationsByStatus,
    updateNotification,
}

export { pushNotificationRepository, PushNotification, UpdatePushNotification, Status };
