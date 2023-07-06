export function buildErrorMessage(error){
    return JSON.stringify(error.response.data.error, null, 2)
}