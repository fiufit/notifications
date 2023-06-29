import { jest } from '@jest/globals';
import { PushNotificationModel } from '@models/push-notification-model';
import { pushNotificationRepository, Status } from '@src/repositories/push-notification-repository';

jest.mock('@models/push-notification-model');

test('Test 01 - Get_push_notifications_with_limit_1_and_2_notifications_should_return_1_notification', async () => {
    const userId = 'xNpYIehaZEYGcjXlbbtQEIG4WYo1';
    const limit = 1;
    const mockReturn = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementationOnce(() => {
            const notifications = [];
            for (let i = 1; i <= limit + 1; ++i) {
                notifications.push({
                    _id: '6498c714f6d9428abe6ef42b',
                    user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
                    device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
                    created_at: new Date('2023-06-25T23:00:36.203+00:00'),
                })
            }
            return notifications;
        }),
    };

    (PushNotificationModel.find as jest.MockedFunction<any>).mockReturnValueOnce(mockReturn);
    const response = await pushNotificationRepository.findNotifications({ user_id: userId, created_at: '2023-06-25' }, { limit });
    expect(response.notifications).toHaveLength(limit);
});

test('Test 02 - Get_push_notifications_with_limit_10_and_5_notifications_should_return_5_notifications', async () => {
    const userId = 'xNpYIehaZEYGcjXlbbtQEIG4WYo1';
    const limit = 10;
    const notificationsLength = 5;
    const mockReturn = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementationOnce(() => {
            const notifications = [];
            for (let i = 1; i <= 5; ++i) {
                notifications.push({
                    _id: '6498c714f6d9428abe6ef42b',
                    user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
                    device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
                    created_at: new Date('2023-06-25T23:00:36.203+00:00'),
                })
            }
            return notifications;
        }),
    };

    (PushNotificationModel.find as jest.MockedFunction<any>).mockReturnValueOnce(mockReturn);
    const response = await pushNotificationRepository.findNotifications({ user_id: userId , created_at: '2023-06-25'}, { limit });
    expect(response.notifications).toHaveLength(notificationsLength);
});

test('Test 03 - Get_push_notifications_when_notifications_not_found_return_empty_list', async () => {
    const userId = 'xNpYIehaZEYGcjXlbbtQEIG4WYo1';
    const limit = 1;
    const mockReturn = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValueOnce([]),
    };

    (PushNotificationModel.find as jest.MockedFunction<any>).mockReturnValueOnce(mockReturn);
    const response = await pushNotificationRepository.findNotifications({ user_id: userId, created_at: '2023-06-25' }, { limit });
    expect(response.notifications).toHaveLength(0);
});

test('Test 04 - Get_push_notifications_when_an_error_occurs_should_throw_an_exception', () => {
    const userId = 'xNpYIehaZEYGcjXlbbtQEIG4WYo1';
    const limit = 1;
    const mockReturn = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementationOnce(async () => { throw new Error('MOCK_ERROR') }),
    };

    (PushNotificationModel.find as jest.MockedFunction<any>).mockReturnValueOnce(mockReturn);
    const response = pushNotificationRepository.findNotifications({ user_id: userId, created_at: '2023-06-25' }, { limit });
    expect(response).rejects.toThrow();
});

test('Test 05 - Get_push_notifications_by_id_when_user_has_2_notifications_should_return_2_notifications', () => {
    const userId = 'xNpYIehaZEYGcjXlbbtQEIG4WYo1';

    (PushNotificationModel.find as jest.MockedFunction<any>).mockResolvedValueOnce([{
        _id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        created_at: new Date('2023-06-25T23:00:36.203+00:00'),
    },
    {
        _id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        created_at: new Date('2023-06-25T23:00:36.203+00:00'),
    }]);
    const notifications = pushNotificationRepository.findNotificationsByUserId(userId);
    expect(notifications).resolves.toHaveLength(2);
});

test('Test 06 - Get_push_notifications_by_id_when_an_error_occurs_should_throw_an_exception', () => {
    const userId = 'xNpYIehaZEYGcjXlbbtQEIG4WYo1';

    (PushNotificationModel.find as jest.MockedFunction<any>).mockImplementationOnce(async () => { throw new Error('MOCK_ERROR') });
    const response = pushNotificationRepository.findNotificationsByUserId(userId);
    expect(response).rejects.toThrow();
});

test('Test 07 - Get_push_notifications_by_status_when_exists_2_notifications_should_return_2_notifications', () => {
    const status = Status.Failed;

    (PushNotificationModel.find as jest.MockedFunction<any>).mockResolvedValueOnce([{
        _id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        created_at: new Date('2023-06-25T23:00:36.203+00:00'),
    },
    {
        _id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        created_at: new Date('2023-06-25T23:00:36.203+00:00'),
    }]);
    const notifications = pushNotificationRepository.findNotificationsByStatus(status);
    expect(notifications).resolves.toHaveLength(2);
});

test('Test 08 - Get_push_notifications_by_status_when_an_error_occurs_should_throw_an_exception', () => {
    const status = Status.Failed;

    (PushNotificationModel.find as jest.MockedFunction<any>).mockImplementationOnce(async () => { throw new Error('MOCK_ERROR') });
    const response = pushNotificationRepository.findNotificationsByStatus(status);
    expect(response).rejects.toThrow();
});

test('Test 09 - Update_push_notifications_should_return_truthy', () => {
    const notificationsToUpdate = [{
        id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
    },
    {
        id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
    }];

    (PushNotificationModel.bulkWrite as jest.MockedFunction<any>).mockResolvedValueOnce({
        "writeErrors" : [ ],
        "writeConcernErrors" : [ ],
        "nInserted" : 0,
        "nUpserted" : 2,
        "nMatched" : 0,
        "nModified" : 0,
        "nRemoved" : 0,
        "upserted" : [ ]
     });
    const notifications = pushNotificationRepository.updateAllNotifications(notificationsToUpdate);
    expect(notifications).resolves.toBeTruthy();
});

test('Test 10 - Update_push_notifications_when_an_error_occurs_should_throw_an_exception', async () => {
    const notificationsToUpdate = [{
        id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
    },
    {
        id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
    }];

    (PushNotificationModel.bulkWrite as jest.MockedFunction<any>).mockImplementationOnce(async () => { throw new Error('MOCK_ERROR') });
    const notifications = pushNotificationRepository.updateAllNotifications(notificationsToUpdate);
    expect(notifications).rejects.toThrow();
});

test('Test 11 - Create_2_push_notifications_should_return_2_notifications', () => {
    const notificationsToCreate = [{
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        title: 'Testing title'
    },
    {
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        title: 'Testing title',
    }];

    (PushNotificationModel.create as jest.MockedFunction<any>).mockResolvedValueOnce([{
        _id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        title: 'Testing title'
    },
    {
        _id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        title: 'Testing title',
    }]);
    const notifications = pushNotificationRepository.saveAllNotifications(notificationsToCreate);
    expect(notifications).resolves.toHaveLength(2);
});

test('Test 12 - Create_push_notifications_when_an_error_occurs_should_throw_an_exception', async () => {
    const notificationsToCreate = [{
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        title: 'Testing title'
    },
    {
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        title: 'Testing title',
    }];

    (PushNotificationModel.create as jest.MockedFunction<any>).mockImplementationOnce(async () => { throw new Error('MOCK_ERROR') });
    const notifications = pushNotificationRepository.saveAllNotifications(notificationsToCreate);
    expect(notifications).rejects.toThrow();
});

test('Test 13 - Update_push_notification_should_return_truthy', () => {
    const notificationToUpdate = {
        id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
    };

    (PushNotificationModel.findOneAndUpdate as jest.MockedFunction<any>).mockResolvedValueOnce({
        _id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        title: 'Testing title'
    });
    const notifications = pushNotificationRepository.updateNotification(notificationToUpdate);
    expect(notifications).resolves.toBeTruthy();
});

test('Test 14 - Update_push_notification_when_an_error_occurs_should_throw_an_exception', async () => {
    const notificationToUpdate = {
        id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
    };

    (PushNotificationModel.findOneAndUpdate as jest.MockedFunction<any>).mockImplementationOnce(async () => { throw new Error('MOCK_ERROR') });
    const notifications = pushNotificationRepository.updateNotification(notificationToUpdate);
    expect(notifications).rejects.toThrow();
});
