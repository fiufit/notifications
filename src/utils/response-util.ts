enum Status {
    Success = 'success',
    Fail = 'fail',
    Error = 'error',
}

interface Fail {
    code: string | null,
    message: string,
}

interface Error {
    code: string | null,
    message: string,
    error: string | null,
}

const _createResponse = (status: Status, data: any | Fail | Error) => {
    return {
        status,
        data,
    }
}

const createSuccessResponse = (data: any) => _createResponse(Status.Success, data)

const createFailResponse = (data: Fail) => _createResponse(Status.Fail, data)

const createErrorResponse = (data: Error) => _createResponse(Status.Error, data)

export { createSuccessResponse, createFailResponse, createErrorResponse };
