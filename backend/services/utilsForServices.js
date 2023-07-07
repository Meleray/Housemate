function assertKeysValid(objectData, requiredKeys, optionalKeys) {
    // TODO may be to do it using sets?
    Object.keys(objectData).forEach((key) => {
        if ((!requiredKeys.includes(key)) && (!optionalKeys.includes(key))) {
            throw new Error(`The object should not contain '${key}'`);
        }
    });

    requiredKeys.forEach((key) => {
        if (!Object.keys(objectData).includes(key)) {
            throw new Error(`The object should contain '${key}'`);
        }
    })
}


// pick({ a: 1, b: '2', c: 3 }, ['x', 'c']);  ->  { 'c': 3 }
const pick = (obj, arr) =>
    arr.reduce((acc, record) => (record in obj && (acc[record] = obj[record]), acc), {});
const randomInviteCode = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(36);
    return n.slice(0, 6);
}

module.exports = {assertKeysValid, pick, randomInviteCode};
