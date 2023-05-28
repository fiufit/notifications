import { logger } from '@src/config';
import mongoose from 'mongoose';

type Subscriber = {
    id: string,
    user_id: string,
    device_token: string,
    unsubscribed: boolean,
}
type CreateSubscriber = Omit<Subscriber, 'id' | 'unsubscribed'>;

const subscriberSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    device_token: { type: String, required: true }, 
    unsubscribed: { type: Boolean, default: false },
}, { collection: 'subscribers' });
const SubscriberModel = mongoose.model('Subscriber', subscriberSchema);

const _documentToSubscriber = (document: any): Subscriber => {
    return { 
        id: document._id.toString(),
        user_id: document.user_id,
        device_token: document.device_token,
        unsubscribed: document.unsubscribed,
    }
}

const findAllSubcribersInUserIds = async (userIds: string []) => {
    try {
        const documents = await SubscriberModel.find({ user_id: { $in: userIds } });
        const subscribers = documents.map((document) => {
            const subscriberResult = _documentToSubscriber(document);
            return subscriberResult;
        });
        return subscribers;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}


const saveSubscriber = async (subscriber: CreateSubscriber): Promise<Subscriber> => {
    try {
        const document =  await SubscriberModel.create(subscriber);
        const subscriberResult = _documentToSubscriber(document);
        return subscriberResult;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const subscriberDatabase = {
    findAllSubcribersInUserIds,
    saveSubscriber,
}

export { subscriberDatabase };
