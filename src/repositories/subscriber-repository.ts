import { logger } from '@src/config';
import { Subscriber, SubscriberModel, Types } from "@models/subscriber-model";

type CreateSubscriber = Omit<Subscriber, 'id' | 'subscribed'>;
type UpdateSubscriber = Pick<Subscriber, 'id'> & Partial<Omit<Subscriber, 'id'>>;
type GetSubscriber = Subscriber;

const _documentToSubscriber = (document: any): GetSubscriber => {
    return {
        id: document._id.toString(),
        user_id: document.user_id,
        device_token: document.device_token,
        subscribed: document.subscribed,
    }
}

const findSubscriberByUserIdAndDeviceToken = async (userId: string, deviceToken: string) => {
    try {
        const document = await SubscriberModel.findOne({ user_id: userId, device_token: deviceToken });
        if (!document) return null;
        const subscriber = _documentToSubscriber(document);
        return subscriber;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const findAllSubcribersInUserIds = async (userIds: string []) => {
    try {
        const documents = await SubscriberModel.find({ user_id: { $in: userIds } });
        const subscribers: Subscriber[] = documents.map((document) => {
            const subscriberResult = _documentToSubscriber(document);
            return subscriberResult;
        });
        return subscribers;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const saveSubscriber = async (subscriber: CreateSubscriber) => {
    try {
        const document =  await SubscriberModel.create(subscriber);
        const subscriberResult = _documentToSubscriber(document);
        return subscriberResult;
    } catch (error: any) {
        logger.error(error);
        throw error;
    }
}

const updateSubscriber = async (subscriber: UpdateSubscriber) => {
    try {
        const filter = { _id: Types.ObjectId(subscriber.id) };
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
    findSubscriberByUserIdAndDeviceToken,
    findAllSubcribersInUserIds,
    saveSubscriber,
    updateSubscriber,
}

export { subscriberRepository };
