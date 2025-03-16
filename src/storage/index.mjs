// src/storage/index.mjs

export function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function get(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

export function remove(key) {
    localStorage.removeItem(key);
}
