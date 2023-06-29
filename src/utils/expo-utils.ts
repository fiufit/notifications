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

const _buildExpoNotification = (notification: PushNotification): ExpoPushMessage => {
    return {
        to: notification.device_token,
        title: notification.title,
        subtitle: notification.subtitle,
        body: notification.body,
        sound: notification.sound as ExpoPushMessage['sound'],
        data: notification.data,
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

const sendPushNotification = async (notifications: PushNotification[]) => {
    const notificationChunks = _chunkPushNotifications(notifications);
    const { pendingNotificationsToUpdate, failedNotificationsToUpdate } = await _sendPushNotificationChunks(notificationChunks);
    const notificationsToUpdate = [...pendingNotificationsToUpdate, ...failedNotificationsToUpdate];
    return await pushNotificationRepository.updateAllNotifications(notificationsToUpdate);
}

export { sendPushNotification };
