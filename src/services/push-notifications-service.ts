import { CreatePushNotification } from '@services/schemas';
import { CreatePushNotificationType } from '@src/controllers/schemas';
import { pushNotificationRepository, subscriberRepository } from '@src/repositories';
import { sendPushNotification } from '@utils/expo-utils';

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

const pushNotificationService = {
    createNotification,
};
  
export { pushNotificationService };
