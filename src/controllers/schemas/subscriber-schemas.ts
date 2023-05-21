import Expo from "expo-server-sdk";
import { z } from "zod";
import { Issue } from "@utils/response-utils";

const CreateSubscriberSchema = z.object({
    body: z.object({
        user_id: z.string().trim(),
        device_token: z.string().trim().refine((token) => Expo.isExpoPushToken(token), {
            params: { code: Issue.InvalidDeviceToken.code },
            message: Issue.InvalidDeviceToken.message,
        }),
    })
})

type CreateSubscriberType = z.infer<typeof CreateSubscriberSchema>;

export { CreateSubscriberSchema, CreateSubscriberType };
