import { CreatePushNotification } from '@services/schemas';
import { CreatePushNotificationType } from '@src/controllers/schemas';
import { pushNotificationDatabase, subscriberDatabase } from '@src/database';
import { sendPushNotification } from '@utils/expo-utils';

const createNotification = async (notification: CreatePushNotification) => {
    const { to_user_id: toUserId, title, subtitle, body, sound } = notification;
    const subscribers = await subscriberDatabase.findAllSubcribersInUserIds(toUserId);
    const deviceTokens = subscribers.map(subscriber => subscriber.device_token);

    if (deviceTokens.length === 0) { return []; }
    const notificationsToSave = deviceTokens.map(deviceToken => {
        return { device_token: deviceToken, title, subtitle, body, sound: sound as CreatePushNotificationType['body']['sound'] };
    });
    const notificationsToSend = await pushNotificationDatabase.saveAllNotifications(notificationsToSave);
    await sendPushNotification(notificationsToSend);
    return notificationsToSend;
};

const pushNotificationService = {
    createNotification,
};
  
export { pushNotificationService };
