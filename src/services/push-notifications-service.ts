import { CreatePushNotification } from '@services/schemas';
import { CreatePushNotificationType } from '@src/controllers/schemas';
import { pushNotificationRepository, subscriberRepository } from '@src/repositories';
import { sendPushNotification } from '@utils/expo-utils';

const createNotification = async (notification: CreatePushNotification) => {
    const { to_user_id: toUserId, title, subtitle, body, sound } = notification;
    const subscribers = await subscriberRepository.findAllSubcribersInUserIds(toUserId);

    if (subscribers.length === 0) { return []; }
    const notificationsToSave = subscribers.map(subscriber => {
        const { user_id, device_token } = subscriber;
        return { user_id, device_token, title, subtitle, body, sound: sound as CreatePushNotificationType['body']['sound'] };
    });
    const notificationsToSend = await pushNotificationRepository.saveAllNotifications(notificationsToSave);
    await sendPushNotification(notificationsToSend);
    return notificationsToSend;
};

const pushNotificationService = {
    createNotification,
};
  
export { pushNotificationService };
