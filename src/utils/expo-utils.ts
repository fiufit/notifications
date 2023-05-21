import { 
    Expo, ExpoPushMessage, ExpoPushTicket, 
    ExpoPushSuccessTicket, ExpoPushErrorTicket, ExpoPushReceipt
} from 'expo-server-sdk';

enum ExpoStatus {
    Ok = 'ok',
    Error = 'error',
}

const expo = new Expo();

const _sendPushNotificationChunks = async (chunks: ExpoPushMessage[][]) => {
    const tickets = [];
    for (const chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }
    return tickets;
}

const _getReceiptsFromTickets = (tickets: ExpoPushTicket[]) => {
    const receiptSuccessTicketIds = [];
    const receiptErrorTickets = [];
    for (const ticket of tickets) {
        if (ticket.status === ExpoStatus.Ok) {
            const successTicket = ticket as ExpoPushSuccessTicket;
            receiptSuccessTicketIds.push(successTicket.id);
        } else {
            const errorTicket = ticket as ExpoPushErrorTicket;
            receiptErrorTickets.push({
                message: errorTicket.message,
                detail: errorTicket.details?.error,
            });
        }
    }
    return { receiptSuccessTicketIds, receiptErrorTickets };
}

const _validateReceiptTickets = (receipts: { [id: string]: ExpoPushReceipt; }) => {
    const receiptErrors = [];
    for (const receiptId in receipts) {
        const receipt = receipts[receiptId];
        if (receipt.status === ExpoStatus.Error) {
            receiptErrors.push({
                message: receipt.message,
                detail: receipt.details?.error,
            });
        }
    }
    return receiptErrors;
}

const _processReceiptSuccessTicketIdChunks = async (receiptSuccessTicketIdChunks: string[][]) => {
    const receiptErrors = [];
    for (const chunk of receiptSuccessTicketIdChunks) {
        try {
            const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            receiptErrors.push(..._validateReceiptTickets(receipts));
        } catch (error) {
            console.error(error);
        }
    }
    return receiptErrors;
}

const sendPushNotification = async (notifications: ExpoPushMessage[]) => {
    const notificationChunks = expo.chunkPushNotifications(notifications);
    const tickets = await _sendPushNotificationChunks(notificationChunks);
    const { receiptSuccessTicketIds, receiptErrorTickets } = _getReceiptsFromTickets(tickets);
    console.log(receiptErrorTickets);
    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptSuccessTicketIds);
    const receiptErrors = _processReceiptSuccessTicketIdChunks(receiptIdChunks);
    return receiptErrors;
}

export { sendPushNotification }
