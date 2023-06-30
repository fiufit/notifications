import { CreatePushNotificationType, GetPushNotificationType, PatchPushNotificationType } from '@src/controllers/schemas';

type GetPushNotification = GetPushNotificationType['query'];
type CreatePushNotification = CreatePushNotificationType['body'];
type PatchPushNotification = PatchPushNotificationType['body'];

export { GetPushNotification, CreatePushNotification, PatchPushNotification };
