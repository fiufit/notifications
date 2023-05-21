import mongoose from 'mongoose';

type Subscriber = {
    id: string,
    user_id: string,
    device_token: string,
}
type CreateSubscriber = Omit<Subscriber, 'id'>;

const subscriberSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    device_token: { type: String, required: true }, 
}, { collection: 'subscribers' });
const SubscriberModel = mongoose.model('Subscriber', subscriberSchema);

const _documentToSubscriber = (document: any): Subscriber => {
    return { 
        id: document._id.toString(),
        user_id: document.user_id,
        device_token: document.device_token,
    }
}

const findAllSubcribersInUserIds = async (userIds: string []) => {
    const documents = await SubscriberModel.find({ user_id: { $in: userIds } });
    const subscribers = documents.map((document) => {
        const subscriberResult = _documentToSubscriber(document);
        return subscriberResult;
    });
    return subscribers;
}


const saveSubscriber = async (subscriber: CreateSubscriber): Promise<Subscriber> => {
    const document =  await SubscriberModel.create(subscriber);
    const subscriberResult = _documentToSubscriber(document);
    return subscriberResult;
}

const subscriberDatabase = {
    findAllSubcribersInUserIds,
    saveSubscriber,
}

export { subscriberDatabase };
