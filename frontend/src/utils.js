export function buildErrorMessage(error) {
    let errorMessage;
    if (error.response.data.error !== undefined) {
        errorMessage = error.response.data.error
    } else {
        errorMessage = {
            message: error.message,
            method: error.response.config.method,
            url: error.response.config.url,
        }
        errorMessage = JSON.stringify(errorMessage, null, 4);
    }
    return errorMessage
}

export function getSafe(obj, propertyName) {
    if (!obj.hasOwnProperty(propertyName)) {
        const err = new Error(`Unknown property: ${propertyName}`);
        console.error(err);
    }
    // returns 'undefined' if the object does not have this property
    return obj[propertyName];
}
