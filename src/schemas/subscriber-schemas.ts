import { z } from "zod";

const CreateSubscriberSchema = z.object({
    body: z.object({
        user_id: z.string().trim(),
        device_id: z.string().trim(),
    })
})

type CreateSubscriberType = z.infer<typeof CreateSubscriberSchema>;

export { CreateSubscriberSchema, CreateSubscriberType };
