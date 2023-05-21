import { CreatePushNotification } from '@services/schemas';
import { pushNotificationDatabase, subscriberDatabase } from '@src/database';
import { sendPushNotification } from '@utils/expo-utils';
import { ExpoPushMessage } from 'expo-server-sdk';

const createNotification = async (notification: CreatePushNotification) => {
    const { to_user_id: toUserId, title, subtitle, body, sound } = notification;
    const subscribers = await subscriberDatabase.findAllSubcribersInUserIds(toUserId);
    const deviceTokens = subscribers.map(subscriber => subscriber.device_token);
    if (deviceTokens.length === 0) { return []; }

    const notificationsToSave = deviceTokens.map(deviceToken => {
        return { device_token: deviceToken, title, subtitle, body };
    });

    const notificationsToSend = deviceTokens.map(token => {
        const _sound = sound as ExpoPushMessage['sound'];
        return { to: token, body, sound: _sound }
    });
    await sendPushNotification(notificationsToSend);
    return pushNotificationDatabase.saveAllNotifications(notificationsToSave);
};

const pushNotificationService = {
    createNotification,
};
  
export { pushNotificationService };
