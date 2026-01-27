function generateId() {
    const timePart = Date.now().toString().slice(-8);
    const randomPart = Math.floor(Math.random() * 5000);
    return timePart + randomPart;
}
