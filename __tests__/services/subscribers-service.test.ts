import { jest } from '@jest/globals';
import { subscriberRepository } from '@repositories/subscriber-repository';
import { subscriberService } from '@src/services';

jest.mock('@repositories/subscriber-repository');

test('Test 01 - Create_subscriber_when_subscriber_exists_should_set_subscribed_true', () => {
    const subscriberToCreate = { 
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1', 
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]' 
    };

    (subscriberRepository.findSubscriberByUserIdAndDeviceToken as jest.MockedFunction<any>).mockResolvedValueOnce({
        id: 'ObjectId(6498c714f6d9428abe6ef42b)',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        subscribed: false,
    });

    (subscriberRepository.updateSubscriber as jest.MockedFunction<any>).mockResolvedValueOnce({
        id: 'ObjectId(6498c714f6d9428abe6ef42b)',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        subscribed: true,
    });
    
    const subscriber = subscriberService.createSubscriber(subscriberToCreate);
    expect(subscriber).resolves.toHaveProperty('subscribed', true);
});

test('Test 02 - Create_subscriber_when_subscriber_doesnt_exists_should_return_truthy', () => {
    const subscriberToCreate = { 
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1', 
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]' 
    };

    (subscriberRepository.findSubscriberByUserIdAndDeviceToken as jest.MockedFunction<any>).mockResolvedValueOnce(null);

    (subscriberRepository.saveSubscriber as jest.MockedFunction<any>).mockResolvedValueOnce({
        id: 'ObjectId(6498c714f6d9428abe6ef42b)',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        subscribed: true,
    });
    
    const subscriber = subscriberService.createSubscriber(subscriberToCreate);
    expect(subscriber).resolves.toBeTruthy();
});

test('Test 03 - Patch_subscriber_should_return_truthy', () => {
    const subscriberId = '6498c714f6d9428abe6ef42b';
    const subscriberToPatch = { 
        subscribed: false,
    };

    (subscriberRepository.updateSubscriber as jest.MockedFunction<any>).mockResolvedValueOnce({
        id: 'ObjectId(6498c714f6d9428abe6ef42b)',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        subscribed: true,
    });
    
    const subscriber = subscriberService.patchSubscriber(subscriberId, subscriberToPatch);
    expect(subscriber).resolves.toBeTruthy();
});
