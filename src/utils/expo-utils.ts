import { PushNotification, pushNotificationRepository, Status, UpdatePushNotification } from '@src/repositories/push-notification-repository';
import { logger } from '@src/config';
import { 
    Expo, ExpoPushMessage, ExpoPushTicket, ExpoPushSuccessTicket, ExpoPushReceipt, ExpoPushErrorTicket, ExpoPushErrorReceipt,
} from 'expo-server-sdk';

const expo = new Expo();

enum ExpoStatus {
    Ok = 'ok',
    Error = 'error',
}

const _buildExpoNotification = (notification: PushNotification) => {
    return { 
        to: notification.device_token,
        title: notification.title,
        subtitle: notification.subtitle,
        body: notification.body,
        sound: notification.sound as ExpoPushMessage['sound'],
    }
}

const _chunkPushNotifications = (notifications: PushNotification[]) => {
    const notificationsToChunk = notifications.map(notification => _buildExpoNotification(notification));
    const notificationChunks = expo.chunkPushNotifications(notificationsToChunk);
    const transformedChunk = [];
    let chunkCounter = 0;
    let lastChunkLength = 0;
    for (const notificationChunk of notificationChunks) {
        const chunk = [];
        for (let index = 0; index < notificationChunk.length; ++index) {
            chunk.push({
                data: notificationChunk[index],
                notifications: notifications[(lastChunkLength * chunkCounter) + index],
            });
        }
        transformedChunk.push(chunk);
        lastChunkLength = notificationChunk.length;
        ++chunkCounter;
    }
    return transformedChunk;
}

const _getReceiptsFromTickets = (ticketChunk: ExpoPushTicket[], notificationChunk: PushNotification[]) => {
    const receipts = [];
    const errors = [];

    for (let index = 0; index < ticketChunk.length; ++index) {
        const ticket = ticketChunk[index];
        const notification = notificationChunk[index];
        if (ticket.status === ExpoStatus.Ok) {
            const successTicket = ticket as ExpoPushSuccessTicket;
            const successDetail = {
                receiptId: successTicket.id,
                notificationId: notification.id,
            }
            receipts.push(successDetail);
        } else {
            const errorTicket = ticket as ExpoPushErrorTicket;
            const errorDetail = {
                notificationId: notification.id,
                error: errorTicket.details?.error,
                message: errorTicket.message,
            }
            errors.push(errorDetail);
            logger.error({ errorDetail });
        }
    }
    return { receipts, errors };
}

const _sendPushNotificationChunks = async (notificationChunks: { data: ExpoPushMessage; notifications: PushNotification; }[][]) => {
    const pendingNotificationsToUpdate = [];
    const failedNotificationsToUpdate = [];
    for (const notificationChunk of notificationChunks) {
        const data = notificationChunk.map(notification => notification.data);
        const notifications = notificationChunk.map(notfication => notfication.notifications);
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(data);
            const { receipts, errors } = _getReceiptsFromTickets(ticketChunk, notifications);

            const pendingNotifications = receipts.map(receipt => {
                const singlePendingNotification: UpdatePushNotification = {
                    id: receipt.notificationId,
                    status: Status.Pending,
                    expoReceiptId: receipt.receiptId,
                };
                return singlePendingNotification;
            })

            const failedNotifications: UpdatePushNotification[] = errors.map(error => {
                const singleFailedNotification: UpdatePushNotification = {
                    id: error.notificationId,
                    status: Status.Failed,
                };
                return singleFailedNotification;
            });

            pendingNotificationsToUpdate.push(...pendingNotifications);
            failedNotificationsToUpdate.push(...failedNotifications);
        } catch (error) {
            const failedNotifications: UpdatePushNotification[] = notifications.map(notification => {
                const singleFailedNotification: UpdatePushNotification = {
                    id: notification.id,
                    status: Status.Failed,
                };
                return singleFailedNotification;
            });
            failedNotificationsToUpdate.push(...failedNotifications);
            logger.error({ error });
        }
    }
    return { pendingNotificationsToUpdate, failedNotificationsToUpdate };
}

const _validateNotificationReceipts = (receipts: { [id: string]: ExpoPushReceipt }, notifications: PushNotification[]) => {
    const successResults = [];
    const errorResults = [];
    let index = 0;
    for (const receiptId in receipts) {
        const receipt = receipts[receiptId];
        if (receipt.status === ExpoStatus.Ok) {
            const successDetail = {
                id: notifications[index].id,
            }
            successResults.push(successDetail);
        } else {
            const errorReceipt = receipt as ExpoPushErrorReceipt;
            const errorDetail = {
                id: notifications[index].id,
                error: errorReceipt.details?.error,
                message: errorReceipt.message,
            }
            errorResults.push(errorDetail);
        }
        ++index;
    }
    return { successResults, errorResults };
}

const _processPushNotificationReceiptChunks = async (receiptChunks: { data: { id: string; }; notification: PushNotification; }[][]) => {
    const successNotificationsToUpdate = [];
    const failedNotificationsToUpdate = [];

    for (const chunk of receiptChunks) {
        const receiptIds = chunk.map(receipt => receipt.data.id);
        const notifications = chunk.map(receipt => receipt.notification);
        try {
            const expoReceipts = await expo.getPushNotificationReceiptsAsync(receiptIds);
            const { successResults, errorResults } = _validateNotificationReceipts(expoReceipts, notifications);

            const successNotifications = successResults.map(result => {
                const singleSuccessNotification: UpdatePushNotification = {
                    id: result.id,
                    status: Status.Delivered,
                };
                return singleSuccessNotification;
            })

            const failedNotifications = errorResults.map(result => {
                const singleFailedNotification: UpdatePushNotification = {
                    id: result.id,
                    status: Status.Failed,
                };
                return singleFailedNotification;
            })

            successNotificationsToUpdate.push(...successNotifications);
            failedNotificationsToUpdate.push(...failedNotifications);
        } catch (error) {
            const failedNotifications: UpdatePushNotification[] = notifications.map(notification => {
                const singleFailedNotification: UpdatePushNotification = {
                    id: notification.id,
                    status: Status.Failed,
                };
                return singleFailedNotification;
            });
            failedNotificationsToUpdate.push(...failedNotifications);
            logger.error({ error });
        }
    }
    return { successNotificationsToUpdate, failedNotificationsToUpdate };
}

const _chunkPushNotificationReceipts = (pendingNotifications: PushNotification[]) => {
    const receiptIds = pendingNotifications.map(notification => notification.expoReceiptId) as string[];
    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    const receiptChunks = [];
    let chunkCounter = 0;
    let lastChunkLength = 0;
    for (const chunk of receiptIdChunks) {
        const receiptChunk = [];
        for (let index = 0; index < chunk.length; ++index) {
            receiptChunk.push({
                data: { id: chunk[index] },
                notification: pendingNotifications[(lastChunkLength * chunkCounter) + index],
            });
        }
        receiptChunks.push(receiptChunk);
        lastChunkLength = chunk.length;
        ++chunkCounter;
    }
    return receiptChunks;
}

const updateNotificationReceipts = async () => {
    const pendingNotifications = await pushNotificationRepository.findNotificationsByStatus(Status.Pending);
    const receiptChunks = _chunkPushNotificationReceipts(pendingNotifications);
    const { successNotificationsToUpdate, failedNotificationsToUpdate } = await _processPushNotificationReceiptChunks(receiptChunks);
    const notificationsToUpdate = [...successNotificationsToUpdate, ...failedNotificationsToUpdate];
    await pushNotificationRepository.updateAllNotifications(notificationsToUpdate);
}

const sendPushNotification = async (notifications: PushNotification[]) => {
    const notificationChunks = _chunkPushNotifications(notifications);
    const { pendingNotificationsToUpdate, failedNotificationsToUpdate } = await _sendPushNotificationChunks(notificationChunks);
    const notificationsToUpdate = [...pendingNotificationsToUpdate, ...failedNotificationsToUpdate];
    return await pushNotificationRepository.updateAllNotifications(notificationsToUpdate);
}

export { sendPushNotification, updateNotificationReceipts };
