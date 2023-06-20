import { GetPushNotification, CreatePushNotification, PatchPushNotification } from '@services/schemas';
import { CreatePushNotificationType } from '@src/controllers/schemas';
import { pushNotificationRepository, subscriberRepository } from '@src/repositories';
import { sendPushNotification } from '@utils/expo-utils';

const getNotifications = async (query: GetPushNotification) => {
    const filter: any = {};
    const options: any = {};
    if (query.user_id) filter.user_id = query.user_id;
    if (query.next_cursor) filter.created_at = Buffer.from(query.next_cursor, 'base64').toString();
    if (query.read) filter.read = query.read;
    if (query.limit) options.limit = query.limit;

    const notifications = await pushNotificationRepository.findNotifications(filter, options);
    return notifications;
}

const createNotification = async (notification: CreatePushNotification) => {
    const { to_user_id: toUserId, title, subtitle, body, sound, data } = notification;
    const subscribers = await subscriberRepository.findAllSubcribersInUserIds(toUserId);
    if (subscribers.length === 0) { return []; }

    const notificationToSend = [];
    const notificationsNotToSend = [];
    for (const subscriber of subscribers) {
        const { user_id, device_token } = subscriber;
        const notifySubscriber = subscriber.subscribed === true;
        const notification = { 
            user_id, device_token, title, subtitle, body, sound: sound as CreatePushNotificationType['body']['sound'], data 
        };
        if (notifySubscriber) notificationToSend.push(notification);
        else notificationsNotToSend.push(notification);
    }
    
    const [notificationsToSendSaved, notificationsNotToSendSaved] = await Promise.all([
        pushNotificationRepository.saveAllNotifications(notificationToSend), 
        pushNotificationRepository.saveAllNotifications(notificationsNotToSend)
    ]);
    await sendPushNotification(notificationsToSendSaved);
    return [...notificationsToSendSaved, ...notificationsNotToSendSaved];
};

const patchNotification = async (notificationId: string, patchData: PatchPushNotification) => {
    const result = await pushNotificationRepository.updateNotification({
        id: notificationId,
        read: patchData.read,
    });
    return result;
};

const pushNotificationService = {
    getNotifications,
    createNotification,
    patchNotification,
};
  
export { pushNotificationService };
