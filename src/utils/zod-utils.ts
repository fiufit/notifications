import { ZodError, ZodIssue, ZodIssueCode } from "zod"

const _getCustomCode = (zodIssue: ZodIssue) => {
    return (zodIssue as any).params?.code || zodIssue.code;
}

const _getCode = (zodIssue: ZodIssue) => {
    if (zodIssue.code == ZodIssueCode.custom) {
        return _getCustomCode(zodIssue);
    }
    return zodIssue.code;
}

const parseZodError = (error: ZodError) => {
    const issues = error.issues;
    return issues.map((issue) => {
        return {
            code: _getCode(issue),
            message: issue.message,
            path: issue.path.join('.'),
        }
    })
}

export { parseZodError };
