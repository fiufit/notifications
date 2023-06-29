import { Expo } from 'expo-server-sdk';
import { sendPushNotification, updateNotificationReceipts } from '@utils/expo-utils';
import { pushNotificationRepository, Status } from '@src/repositories/push-notification-repository';

jest.mock('expo-server-sdk');
jest.mock('@src/repositories/push-notification-repository');

test('Test 01 - Send_push_notifications_should_return_truthy', async () => {
    const notificationsToSend = [
        {
            id: '6498c714f6d9428abe6ef42b',
            to: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
            title: 'MOCK TITLE',
            user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
            device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
            read: false,
        },
        {
            id: '6498c714f6d9428abe6ef42b',
            to: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
            title: 'MOCK TITLE',
            user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
            device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
            read: false,
        }
    ];

    jest.spyOn(Expo.prototype, 'chunkPushNotifications').mockReturnValueOnce(
        [
            [{ 
                to: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
                title: 'MOCK TITLE',
            }],
            [{
                to: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
                title: 'MOCK TITLE',
            }]
        ]
    );

    jest.spyOn(Expo.prototype, 'sendPushNotificationsAsync').mockResolvedValueOnce(
        [
            {
                status: 'ok',
                id: 'ExpoPushReceiptId',
            },
        ]
    );
    jest.spyOn(Expo.prototype, 'sendPushNotificationsAsync').mockResolvedValueOnce(
        [
            {
                status: 'error',
                message: 'Mock error',
                details: {
                    error: 'MessageTooBig',
                },
            }
        ]
    );

    (pushNotificationRepository.updateAllNotifications as jest.MockedFunction<any>).mockResolvedValueOnce({
        "writeErrors" : [ ],
        "writeConcernErrors" : [ ],
        "nInserted" : 0,
        "nUpserted" : 0,
        "nMatched" : 0,
        "nModified" : 2,
        "nRemoved" : 0,
        "upserted" : [ ]
    })
    
    const result = sendPushNotification(notificationsToSend);
    expect(result).resolves.toHaveProperty('nModified', 2);
})

test('Test 02 - Update_notifications_receipts_should_return_truthy', async () => {


    (pushNotificationRepository.findNotificationsByStatus as jest.MockedFunction<any>).mockResolvedValueOnce([
        {
            id: '6498c714f6d9428abe6ef42b',
            user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
            device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
            title: 'Mock title',
            read: false,
            status: Status.Pending,
            expoReceiptId: 'f468b398-3e16-4ad4-8722-dc38fa8f5068',
        },
        {
            id: '6498c714f6d9428abe6ef42c',
            user_id: 'xNpYIehaZEYGcjXlbbtQEIG4WYo1',
            device_token: 'ExponentPushToken[afi_5ZJX9WboNxAoe94eUz]',
            title: 'Mock title',
            read: false,
            status: Status.Pending,
            expoReceiptId: 'f468b398-3e16-4ad4-8722-dc38fa8f5069',
        }
    ])

    jest.spyOn(Expo.prototype, 'chunkPushNotificationReceiptIds').mockReturnValueOnce(
        [
            ['f468b398-3e16-4ad4-8722-dc38fa8f5068'], ['f468b398-3e16-4ad4-8722-dc38fa8f5069']
        ]
    );

    jest.spyOn(Expo.prototype, 'getPushNotificationReceiptsAsync').mockResolvedValueOnce({
        'f468b398-3e16-4ad4-8722-dc38fa8f5068': { status: 'ok' },
    });
    jest.spyOn(Expo.prototype, 'getPushNotificationReceiptsAsync').mockResolvedValueOnce({
        'f468b398-3e16-4ad4-8722-dc38fa8f5069': { status: 'error', details: { error: 'InvalidCredentials' }, message: 'mock message' },
    });

    (pushNotificationRepository.updateAllNotifications as jest.MockedFunction<any>).mockResolvedValueOnce({
        "writeErrors" : [ ],
        "writeConcernErrors" : [ ],
        "nInserted" : 0,
        "nUpserted" : 0,
        "nMatched" : 0,
        "nModified" : 2,
        "nRemoved" : 0,
        "upserted" : [ ]
    })
    
    updateNotificationReceipts();
    expect(pushNotificationRepository.updateAllNotifications).toBeCalled();
})
