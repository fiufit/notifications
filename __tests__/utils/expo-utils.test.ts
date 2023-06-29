import { Expo } from 'expo-server-sdk';
import { sendPushNotification } from '@utils/expo-utils';
import { pushNotificationRepository } from '@src/repositories/push-notification-repository';

jest.mock('expo-server-sdk');
jest.mock('@src/repositories/push-notification-repository');

test('Test 01 - XX', async () => {
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
