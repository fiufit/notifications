import { CreateSubscriber } from '@src/services/schemas';
import { subscriberDatabase } from '@src/database';

const createSubscriber = async (subscriber: CreateSubscriber) => {
    const result = await subscriberDatabase.saveSubscriber(subscriber);
    return result;
};

const subscriberService = {
    createSubscriber,
};
  
export { subscriberService };
