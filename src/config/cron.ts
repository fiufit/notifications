import { updateNotificationReceipts } from '@utils/expo-utils';
import nodeCron from 'node-cron';
import { logger } from '@config/logger';

const scheduleCheckReceipts = () => {
    logger.info('Starting scheduleCheckReceipts')
    nodeCron.schedule(`*/15 * * * *`, () => {
        updateNotificationReceipts();
        logger.info('Running update notification receipts');
    });
}

const cron = {
    scheduleCheckReceipts,
}

export { cron };
