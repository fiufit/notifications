import { CreatePushNotification } from '@services/schemas';
import { pushNotificationDatabase, subscriberDatabase } from '@src/database';
import { sendPushNotification } from '@utils/expo-utils';

const createNotification = async (notification: CreatePushNotification) => {
    const { to_user_id: toUserId, title, subtitle, body, sound } = notification;
    const subscribers = await subscriberDatabase.findAllSubcribersInUserIds(toUserId);
    const deviceTokens = subscribers.map(subscriber => subscriber.device_token);
    const notificationsToSave = deviceTokens.map(deviceToken => {
        return { device_token: deviceToken, title, subtitle, body };
    });
    const notificationsToSend = deviceTokens.map(token => {
        return { to: token, body, sound }
    });
    await sendPushNotification(notificationsToSend);
    return pushNotificationDatabase.saveAllNotifications(notificationsToSave);
};

const pushNotificationService = {
    createNotification,
};
  
export { pushNotificationService };
