import httpStatus from "http-status"

enum Status {
    Success = 'success',
    Fail = 'fail',
    Error = 'error',
}

interface Fail {
    code: string,
    message: string,
    path?: string,
}

interface Error {
    code: string,
    error: string,
    message: string,
}

const _createResponse = (status: Status, data: any | Fail | Error) => {
    return {
        status,
        data,
    }
}

const Issue = {
    InvalidDeviceToken: {
        code: 'invalid_device_token',
        message: 'Device token is not a valid push token',
    },
    NotFoundSubscribers: {
        code: 'not_found_subscribers',
        message: 'Subscribers not found in the database',
    },
    InternalServerError: {
        code: httpStatus.INTERNAL_SERVER_ERROR.toString().toLowerCase(),
    }
}

const createSuccessResponse = (data: any) => _createResponse(Status.Success, data)

const createFailResponse = (data: Fail[]) => _createResponse(Status.Fail, data)

const createErrorResponse = (data: Error) => _createResponse(Status.Error, data)

export { createSuccessResponse, createFailResponse, createErrorResponse, Issue };
