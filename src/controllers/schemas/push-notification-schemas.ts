import { z } from "zod";

const GetPushNotificationSchema = z.object({
    query: z.object({
        user_id: z.string().optional(),
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

type CreatePushNotificationType = z.infer<typeof CreatePushNotificationSchema>;
type GetPushNotificationType = z.infer<typeof GetPushNotificationSchema>;

export {
    CreatePushNotificationSchema, CreatePushNotificationType,
    GetPushNotificationSchema, GetPushNotificationType,    
};
