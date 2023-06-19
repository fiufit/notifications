import { CreatePushNotificationType, GetPushNotificationType } from '@src/controllers/schemas';

type GetPushNotification = GetPushNotificationType['query'];

type CreatePushNotification = CreatePushNotificationType['body'];

export { GetPushNotification, CreatePushNotification };
