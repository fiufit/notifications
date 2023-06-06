import { CreateSubscriber, PatchSubscriber } from '@src/services/schemas';
import { subscriberRepository } from '@src/repositories';

const createSubscriber = async (subscriber: CreateSubscriber) => {
    const result = await subscriberRepository.saveSubscriber(subscriber);
    return result;
};

const patchSubscriber = async (subscriberId: string, patchData: PatchSubscriber) => {
    const result = await subscriberRepository.updateSubscriber({
        id: subscriberId,
        subscribed: patchData.subscribed,
    });
    return result;
};

const subscriberService = {
    createSubscriber,
    patchSubscriber
};
  
export { subscriberService };
