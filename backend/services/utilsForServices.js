function areKeysValid(objectData, validKeys) {
    Object.keys(objectData).forEach((key) => {
        if (!validKeys.includes(key)) {
            return  {errorMessage: `The field '${key}' can not be set`}
        }
    });
    return {}; // empty object
}

const randomInviteCode = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(36);
    return n.slice(0, 6);
}

module.exports = {areKeysValid, randomInviteCode};
