const chai = require("chai");

function compareObjects(responseObj, referenceObj, ignoreKeys = []) {
    let keyUnion = [...Object.keys(responseObj), ...Object.keys(referenceObj)];

    keyUnion.forEach(key => {
        if (!ignoreKeys.includes(key)) {
            chai.expect(responseObj[key], JSON.stringify({failedKey: key, body: responseObj}))
                .to.be.eql(referenceObj[key]);
        }
    });
}

function generateRandomStr() {
    // return random string like 'feq9n', 'relrj', '5mxg9', ...
    return (Math.random() + 1).toString(36).substring(8)
}

const nonExistId = "ffffffffffffffffffffffff"

module.exports = {compareObjects, generateRandomStr, nonExistId};
