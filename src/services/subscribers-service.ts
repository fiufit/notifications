import { CreateSubscriberType } from "@src/controllers/schemas";

const createSubscriber = (subscriber: CreateSubscriberType) => {
    console.log(subscriber);
};

const subscriberService = {
    createSubscriber,
};
  
export { subscriberService };
