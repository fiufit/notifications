import { CreateSubscriberType, PatchSubscriberType } from '@src/controllers/schemas';

type CreateSubscriber = CreateSubscriberType['body'];
type PatchSubscriber = PatchSubscriberType['body'];

export { CreateSubscriber, PatchSubscriber };
