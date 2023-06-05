import { logger } from '@src/config';
import mongoose from 'mongoose';

type Subscriber = {
    id: string,
    user_id: string,
    device_token: string,
    subscribed: boolean,
}
type CreateSubscriber = Omit<Subscriber, 'id' | 'subscribed'>;
type UpdateSubscriber = Pick<Subscriber, 'id'> & Partial<Omit<Subscriber, 'id'>>;

const subscriberSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    device_token: { type: String, required: true }, 
    subscribed: { type: Boolean, default: true },
}, { collection: 'subscribers' });
const SubscriberModel = mongoose.model('Subscriber', subscriberSchema);

const _documentToSubscriber = (document: any): Subscriber => {
    return { 
        id: document._id.toString(),
        user_id: document.user_id,
        device_token: document.device_token,
        subscribed: document.subscribed,
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

const updateSubscriber = async (subscriber: UpdateSubscriber) => {
    try {
        const filter = { _id: new mongoose.Types.ObjectId(subscriber.id) };
        const options = { returnOriginal: false };
        const document = await SubscriberModel.findOneAndUpdate(filter, subscriber, options);
        const updateResult = _documentToSubscriber(document);
        return updateResult;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const subscriberRepository = {
    findAllSubcribersInUserIds,
    saveSubscriber,
    updateSubscriber,
}

export { subscriberRepository };
