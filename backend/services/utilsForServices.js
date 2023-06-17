function areKeysValid(objectData, validKeys) {
    Object.keys(objectData).forEach((key) => {
        if (!validKeys.includes(key)) {
            return  {errorMessage: `The field '${key}' can not be set`}
        }
    });
    return {}; // empty object
}

module.exports = {areKeysValid};
