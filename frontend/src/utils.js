export function buildErrorMessage(error) {
    const errorMessage = {
        message: error.message,
        method: error.response.config.method,
        url: error.response.config.url,
        data: error.response.config.data
    }
    return JSON.stringify(errorMessage, null, 4);
}

export function getSafe(obj, propertyName) {
    if (!obj.hasOwnProperty(propertyName)){
        const err = new Error(`Unknown property: ${propertyName}`);
        console.error(err);
    }
    // returns 'undefined' if the object does not have this property
    return obj[propertyName];
}
