export function isBadRequestError(message: string) {
    const errorMessage = message.toLowerCase();
    const badRequestKeywords = ['invalid', 'must', 'bad', 'wrong', 'malformed', 'format', 'missing', 'required', 'incorrect'];
    return badRequestKeywords.some(keyword => errorMessage.includes(keyword));
}
export function isServerError(message: string) {
    const errorMessage = message.toLowerCase();
    const serverErrorKeywords = ['internal server error', 'unhandled', 'exception', 'failed', 'database', 'timeout', 'unavailable', 'crash'];
    return serverErrorKeywords.some(keyword => errorMessage.includes(keyword));
}

export function HttpErrorHandle(code:string,error:any,set:any){
    const createErrorResponse = (status:number, message:string) => ({
        status,
        success: false,
        duration: null,
        response: null,
        error_message: [message]
    });
    if (code === "UNKNOWN") {
        if (error.message === "Unauthorized") {
            set.status = 403;
            return createErrorResponse(403, "Unauthorized: Access is denied due to insufficient permissions.");
        } else if (error.message === "Unauthenticated") {
            set.status = 401;
            return createErrorResponse(401, "Unauthenticated: You must authenticate first to access this resource.");
        } else if (isBadRequestError(error.message)) {
            set.status = 400;
            return createErrorResponse(400, error.message);
        } else if (isServerError(error.message)) {
            set.status = 500;
            return createErrorResponse(500, error.message || "Internal Server Error: An unexpected error occurred.");
        }
    }    
}
