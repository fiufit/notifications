import { jest } from '@jest/globals';
import { pushNotificationRepository } from '@repositories/push-notification-repository';
import { pushNotificationService } from '@src/services';

jest.mock('@repositories/push-notification-repository');

test('Test 01 - Get_notifications_with_query_params_should_return_truthy', () => {
    const queryParams = { 
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1', 
    };

    (pushNotificationRepository.findNotifications as jest.MockedFunction<any>).mockResolvedValueOnce([{
        id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        created_at: new Date('2023-06-25T23:00:36.203+00:00'),
    },
    {
        id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        created_at: new Date('2023-06-25T23:00:36.203+00:00'),
    }]);
    
    const notifications = pushNotificationService.getNotifications(queryParams);
    expect(notifications).resolves.toHaveLength(2);
});

test('Test 02 - Patch_notification_should_return_truthy', () => {
    const notificationId = '6498c714f6d9428abe6ef42b';
    const notificationToPatch = { 
        read: true,
    };

    (pushNotificationRepository.updateNotification as jest.MockedFunction<any>).mockResolvedValueOnce({
        _id: '6498c714f6d9428abe6ef42b',
        user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
        device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
        title: 'Testing title'
    });
    
    const notifications = pushNotificationService.patchNotification(notificationId, notificationToPatch);
    expect(notifications).resolves.toBeTruthy();
});
