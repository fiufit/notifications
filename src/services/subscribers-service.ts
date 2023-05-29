import { CreateSubscriber } from '@src/services/schemas';
import { subscriberRepository } from '@src/repositories';

const createSubscriber = async (subscriber: CreateSubscriber) => {
    const result = await subscriberRepository.saveSubscriber(subscriber);
    return result;
};

const subscriberService = {
    createSubscriber,
};
  
export { subscriberService };
