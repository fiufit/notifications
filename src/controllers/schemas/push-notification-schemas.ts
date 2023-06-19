import { z } from "zod";

const GetPushNotificationSchema = z.object({
    query: z.object({
        user_id: z.string().optional(),
        read: z.enum(['true', 'false']).transform(read => { return read === 'true' }).optional(),
        limit: z.string().transform(limit => parseInt(limit)).optional(),
        next_cursor: z.string().optional(),
    })
});

const CreatePushNotificationSchema = z.object({
    body: z.object({
        to_user_id: z.string().array(),
        title: z.string(),
        subtitle: z.string().optional(),
        body: z.string().optional(),
        sound: z.enum([ 'default' ]).optional(),
        data: z.any(),
    })
})

const PatchPushNotificationSchema = z.object({
    params: z.object({
        notification_id: z.string(),
    }),
    body: z.object({
        read: z.boolean().optional(),
    })
})

type CreatePushNotificationType = z.infer<typeof CreatePushNotificationSchema>;
type GetPushNotificationType = z.infer<typeof GetPushNotificationSchema>;
type PatchPushNotificationType = z.infer<typeof PatchPushNotificationSchema>;

export {
    CreatePushNotificationSchema, CreatePushNotificationType,
    GetPushNotificationSchema, GetPushNotificationType,    
    PatchPushNotificationSchema, PatchPushNotificationType,
};
