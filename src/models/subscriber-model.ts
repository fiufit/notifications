import mongoose from "mongoose";

interface Subscriber {
    id: string,
    user_id: string,
    device_token: string,
    subscribed: boolean,
}

const subscriberSchema = new mongoose.Schema({
    user_id: { type: String,  required: true },
    device_token: { type: String, required: true }, 
    subscribed: { type: Boolean, default: true },
}, { collection: 'subscribers' });
subscriberSchema.index({ user_id: 1, device_token: 1 }, { unique: true });

const Types = {
    ObjectId: (id: string) => {
        return new mongoose.Types.ObjectId(id);
    },
};
const SubscriberModel = mongoose.model<Subscriber>('Subscriber', subscriberSchema);
export { Types, Subscriber, SubscriberModel };