import { CreatePushNotification } from '@services/schemas';
import { CreatePushNotificationType } from '@src/controllers/schemas';
import { pushNotificationRepository, subscriberRepository } from '@src/repositories';
import { sendPushNotification } from '@utils/expo-utils';

const createNotification = async (notification: CreatePushNotification) => {
    const { to_user_id: toUserId, title, subtitle, body, sound } = notification;
    const subscribers = await subscriberRepository.findAllSubcribersInUserIds(toUserId);
    const deviceTokens = subscribers.map(subscriber => subscriber.device_token);

    if (deviceTokens.length === 0) { return []; }
    const notificationsToSave = deviceTokens.map(deviceToken => {
        return { device_token: deviceToken, title, subtitle, body, sound: sound as CreatePushNotificationType['body']['sound'] };
    });
    const notificationsToSend = await pushNotificationRepository.saveAllNotifications(notificationsToSave);
    await sendPushNotification(notificationsToSend);
    return notificationsToSend;
};

const pushNotificationService = {
    createNotification,
};
  
export { pushNotificationService };
