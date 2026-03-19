// ============================================
// STORAGE.JS — localStorage Helper Functions
// ============================================

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key) {
    let data = localStorage.getItem(key);
    if (data === null) {
        return null;
    }
    return JSON.parse(data);
}

function removeFromStorage(key) {
    localStorage.removeItem(key);
}

function existsInStorage(key) {
    return localStorage.getItem(key) !== null;
}