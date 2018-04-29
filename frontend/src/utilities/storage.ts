
const KEYS = {
    auth: 'jumpcut.token'
};

export function getAuthToken(): string {
    return getValue(KEYS.auth);
}

export function storeAuthToken(token: string) {
    if (!token) {
        clearEntry(KEYS.auth);
    } else {
        setValue(KEYS.auth, token);
    }
}

function getValue(key: string) {
    if (typeof localStorage !== 'undefined') {
        return localStorage[key];
    }
}

function setValue(key: string, value: string) {
    if (typeof localStorage !== 'undefined') {
        localStorage[key] = value;
    }
}

function clearEntry(key: string) {
    if (typeof localStorage !== 'undefined') {
        delete localStorage[key];
    }
}