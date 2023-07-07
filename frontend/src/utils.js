export function buildErrorMessage(error){
    const errorMessage = {
        message: error.message,
        method: error.response.config.method,
        url: error.response.config.url,
        data: error.response.config.data
    }
    return JSON.stringify(errorMessage, null, 4);
}