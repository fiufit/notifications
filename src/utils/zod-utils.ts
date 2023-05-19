import { z } from "zod"

const parseZodError = (error: z.ZodError) => {
    const issues = error.issues;
    return issues.map((issue) => {
        return {
            code: issue.code,
            message: issue.message,
            path: issue.path.join('.'),
        }
    })
}

export { parseZodError };
