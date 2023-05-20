import { z } from "zod";

const CreatePushNotificationSchema = z.object({
    body: z.object({
        to_user_id: z.string().array(),
        title: z.string(),
        subtitle: z.string().optional(),
        body: z.string().optional(),
        sound: z.enum([ 'default' ]).optional(),
    })
})

type CreatePushNotificationType = z.infer<typeof CreatePushNotificationSchema>;

export { CreatePushNotificationSchema, CreatePushNotificationType };
