export function isError(response){
    if (Math.floor(response.status / 100) !== 2) {
        alert(response);
        return true;
    }
    return false;
}