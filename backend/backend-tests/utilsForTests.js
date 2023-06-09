const chai = require("chai");

function logRequest(request) {
    const cyanColor = '\x1b[36m%s\x1b[0m'
    const message = `curl ${request.url} -X ${request.method.toUpperCase()} -d '${JSON.stringify(request._data)}' -H "Content-Type: application/json"`
    console.log(cyanColor, message);
}

function checkResponse(responseObj, referenceObj){
    // all the fields from reference object should be presented in the response object
    for (let key in referenceObj) {
            chai.expect(responseObj[key], JSON.stringify(responseObj.body)).to.be.eql(referenceObj[key]);
    }
}

module.exports = {logRequest, checkResponse};
