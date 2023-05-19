import { z } from "zod";

const CreateNotificationSchema = z.object({
    body: z.object({
        to_user_id: z.string().array(),
        title: z.string(),
        subtitle: z.string().optional(),
        body: z.string().optional(),
        sound: z.enum([ 'default' ]).optional(),
    })
})

type CreateNotificationType = z.infer<typeof CreateNotificationSchema>;

export { CreateNotificationSchema, CreateNotificationType };
