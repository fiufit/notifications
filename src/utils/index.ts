import { createSuccessResponse, createFailResponse, createErrorResponse } from "@utils/response-utils";
import { parseZodError } from "@utils/zod-utils";

const responseUtils = {
    createSuccessResponse,
    createFailResponse,
    createErrorResponse,
}

const zodUtils = {
    parseZodError,
}

export { responseUtils, zodUtils };
