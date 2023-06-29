import { jest } from '@jest/globals';
import { SubscriberModel } from '@models/subscriber-model';
import { subscriberRepository } from '@src/repositories';

jest.mock('@models/subscriber-model');

test('Test 01 - Get_subscriber_with_user_id_and_device_token_should_return_truthy', () => {
    const userId = 'MOCK_USER_ID';
    const deviceToken = 'MOCK_DEVICE_TOKEN';
    (SubscriberModel.findOne as jest.MockedFunction<any>).mockResolvedValueOnce({
        _id: 'MOCK_ID1',
        user_id: 'MOCK_USER_ID1',
        device_token: 'MOCK_DEVICE_TOKEN1',
        subscribed: 'MOCK_SUBSCRIBED',
    });
    
    const subscriber = subscriberRepository.findSubscriberByUserIdAndDeviceToken(userId, deviceToken);
    expect(subscriber).resolves.toBeTruthy();
});

test('Test 02 - Get_subscriber_with_non_existent_user_id_and_device_token_should_return_null', () => {
    const userId = 'MOCK_NON_EXISTENT_USER_ID';
    const deviceToken = 'MOCK_NON_EXISTENT_DEVICE_TOKEN';
    (SubscriberModel.findOne as jest.MockedFunction<any>).mockResolvedValueOnce(null);

    const subscriber = subscriberRepository.findSubscriberByUserIdAndDeviceToken(userId, deviceToken);
    expect(subscriber).resolves.toBeNull();
});

test('Test 03 - Get_subscriber_when_an_error_occurs_should_throw_an_exception', () => {
    const userId = 'MOCK_USER_ID1';
    const deviceToken = 'MOCK_DEVICE_TOKEN1';
    (SubscriberModel.findOne as jest.MockedFunction<any>).mockImplementationOnce(async () => { throw new Error('MOCK_ERROR') });
    
    const subscriber = subscriberRepository.findSubscriberByUserIdAndDeviceToken(userId, deviceToken);
    expect(subscriber).rejects.toThrow();
});

test('Test 04 - Get_all_subscribers_with_users_ids_should_return_truthy', () => {
    const userIds = ['MOCK_USER_ID1', 'MOCK_USER_ID2'];
    (SubscriberModel.find as jest.MockedFunction<any>).mockResolvedValueOnce([{
        _id: 'MOCK_ID1',
        user_id: 'MOCK_USER_ID1',
        device_token: 'MOCK_DEVICE_TOKEN1',
        subscribed: 'MOCK_SUBSCRIBED',
    }, {
        _id: 'MOCK_ID2',
        user_id: 'MOCK_USER_ID2',
        device_token: 'MOCK_DEVICE_TOKEN2',
        subscribed: 'MOCK_SUBSCRIBED',
    }]);
    
    const subscriber = subscriberRepository.findAllSubcribersInUserIds(userIds);
    expect(subscriber).resolves.toHaveLength(2);
});

test('Test 05 - Get_all_subscribers_with_users_ids_should_throw_an_exception', () => {
    const userId = ['MOCK_USER_ID1'];
    (SubscriberModel.find as jest.MockedFunction<any>).mockImplementationOnce(async () => { throw new Error('MOCK_ERROR') });
    
    const subscriber = subscriberRepository.findAllSubcribersInUserIds(userId);
    expect(subscriber).rejects.toThrow();
});

test('Test 06 - Save_subscriber_should_return_truthy', () => {
    const subscriber = { user_id: 'MOCK_USER_ID1', device_token: 'MOCK_DEVICE_TOKEN1' };
    (SubscriberModel.create as jest.MockedFunction<any>).mockResolvedValueOnce({
        _id: 'MOCK_ID1',
        user_id: 'MOCK_USER_ID1',
        device_token: 'MOCK_DEVICE_TOKEN1',
        subscribed: 'MOCK_SUBSCRIBED',
    });
    
    const echoSubscriber = subscriberRepository.saveSubscriber(subscriber);
    expect(echoSubscriber).resolves.toBeTruthy();
});

test('Test 07 - Save_subscriber_should_throw_an_exception', () => {
    const subscriber = { user_id: 'MOCK_USER_ID1', device_token: 'MOCK_DEVICE_TOKEN1' };
    (SubscriberModel.create as jest.MockedFunction<any>).mockImplementationOnce(async () => { throw new Error('MOCK_ERROR') });
    
    const echoSubscriber = subscriberRepository.saveSubscriber(subscriber);
    expect(echoSubscriber).rejects.toThrow();
});

test('Test 08 - Update_subscriber_should_return_truthy', () => {
    const subscriber = { id: 'MOCK_ID1', user_id: 'MOCK_USER_ID1', device_token: 'MOCK_DEVICE_TOKEN1' };
    (SubscriberModel.findOneAndUpdate as jest.MockedFunction<any>).mockResolvedValueOnce({
        _id: 'MOCK_ID1',
        user_id: 'MOCK_USER_ID1',
        device_token: 'MOCK_DEVICE_TOKEN1',
        subscribed: 'MOCK_SUBSCRIBED',
    });
    
    const echoSubscriber = subscriberRepository.updateSubscriber(subscriber);
    expect(echoSubscriber).resolves.toBeTruthy();
});

test('Test 09 - Update_subscriber_should_throw_an_exception', () => {
    const subscriber = { id: 'MOCK_ID1', user_id: 'MOCK_USER_ID1', device_token: 'MOCK_DEVICE_TOKEN1' };
    (SubscriberModel.findOneAndUpdate as jest.MockedFunction<any>).mockImplementationOnce(async () => { throw new Error('MOCK_ERROR') });
    
    const echoSubscriber = subscriberRepository.updateSubscriber(subscriber);
    expect(echoSubscriber).rejects.toThrow();
});
