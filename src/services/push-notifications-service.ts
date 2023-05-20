import { CreatePushNotification } from '@src/services/schemas';
import { pushNotificationDatabase, subscriberDatabase } from '@src/database';

const createNotification = async (notification: CreatePushNotification) => {
    const { to_user_id: toUserId, title, subtitle, body } = notification;
    const subscribers = await subscriberDatabase.findAllSubcribersInUserIds(toUserId);
    const deviceTokens = subscribers.map(subscriber => subscriber.device_token);
    const notifications = deviceTokens.map(deviceToken => {
        return { device_token: deviceToken, title, subtitle, body };
    });
    return pushNotificationDatabase.saveAllNotifications(notifications);
};

const pushNotificationService = {
    createNotification,
};
  
export { pushNotificationService };
