const chai = require("chai");

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
    return (Math.random() + 1).toString(36).substring(8)
}
const nonExistId = "ffffffffffffffffffffffff"

module.exports = {compareObjects, generateRandomStr, nonExistId};
