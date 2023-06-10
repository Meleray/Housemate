const chai = require("chai");

function logRequest(request) {
    const cyanColor = '\x1b[36m%s\x1b[0m'
    const message = `curl ${request.url} -X ${request.method.toUpperCase()} -d '${JSON.stringify(request._data)}' -H "Content-Type: application/json"`
    console.log(cyanColor, message);
}

function compareObjects(responseObj, referenceObj, ignoreKeys=new Set([])) {
    let keyUnion = [...new Set([...Object.keys(responseObj), ...Object.keys(referenceObj)])];
    for (let key in keyUnion) {
        if (!ignoreKeys.has(key)) {
            chai.expect(responseObj[key], JSON.stringify(responseObj.body)).to.be.eql(referenceObj[key]);
        }
    }
}

function generateRandomStr(){
    // return random string like 'feq9n', 'relrj', '5mxg9', ...
    return (Math.random() + 1).toString(36).substring(7)
}
const nonExistId = "ffffffffffffffffffffffff"

module.exports = {logRequest, compareObjects, generateRandomStr, nonExistId};
