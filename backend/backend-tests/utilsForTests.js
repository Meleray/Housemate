function logRequest(request) {
    const cyanColor = '\x1b[36m%s\x1b[0m'
    const message = `curl ${request.url} -X ${request.method.toUpperCase()}-d '${JSON.stringify(request._data)}' -H "Content-Type: application/json"`
    console.log(cyanColor, message);
}

module.exports = {logRequest};
